import { CacheAdaptor, DataManager, ODataAdaptor, UrlAdaptor, WebApiAdaptor, WebMethodAdaptor } from "@syncfusion/ej2-data";

export function isNullOrUndefined(val: any) {
  return val === null || val === undefined;
}
export function dropRows(this: any, args: any, isByMethod: any) {
  const grid = this.grid;
  const thisRow = this.grid.rowDragAndDropModule;

  function isRemoteData() {
    if (grid.dataSource instanceof DataManager) {
      const adaptor = grid.dataSource.adaptor;
      return (adaptor instanceof ODataAdaptor ||
        (adaptor instanceof WebApiAdaptor) || (adaptor instanceof WebMethodAdaptor) ||
        (adaptor instanceof CacheAdaptor) || adaptor instanceof UrlAdaptor);
    }
    return false;
  }
  thisRow.dropPosition = thisRow.dropPosition || 'bottomSegment';
  if (thisRow.dropPosition !== 'Invalid' && !isRemoteData()) {
    const tObj = grid;
    let draggedRecord: any;
    let droppedRecord;
    if (isNullOrUndefined(args.dropIndex)) {
      const rowIndex = tObj.getSelectedRowIndexes()[0] - 1;
      const record = tObj.getCurrentViewRecords()[rowIndex];
      thisRow.getParentData(record);
    }
    else {
      const row = args.target.parentElement.children[1] || args.target.parentElement.parentElement.children[1];
      // args.dropIndex = args.dropIndex === args.fromIndex ? thisRow.getTargetIdx(args.target.parentElement) : args.dropIndex;
      args.dropIndex = parseInt(row?.innerText || '0');
      thisRow.droppedRecord = tObj.getCurrentViewRecords().find((e: any) => e.TaskID === args.dropIndex);
      thisRow.draggedRecord
    }
    let dragRecords = [];
    droppedRecord = thisRow.droppedRecord;
    if (!args.data[0]) {
      dragRecords.push(args.data);
    }
    else {
      dragRecords = args.data;
    }
    let count = 0;
    const multiplegrid = grid.rowDropSettings.targetID;
    thisRow.isMultipleGrid = multiplegrid;
    if (!multiplegrid) {
      thisRow.ensuredropPosition(dragRecords, droppedRecord);
    }
    else {
      thisRow.isaddtoBottom = multiplegrid && thisRow.isDraggedWithChild;
    }
    const dragLength = dragRecords.length;
    if (!isNullOrUndefined(grid.idMapping)) {
      dragRecords.reverse();
    }
    for (let i = 0; i < dragLength; i++) {
      draggedRecord = dragRecords[i];
      thisRow.draggedRecord = draggedRecord;
      if (thisRow.dropPosition !== 'Invalid') {
        if (!tObj.rowDropSettings.targetID || isByMethod) {
          tObj.flatData.splice(args.fromIndex, 1);
          thisRow.treeGridData = tObj.flatData;
        }
        if (thisRow.draggedRecord === thisRow.droppedRecord) {
          let correctIndex = thisRow.getTargetIdx(args.target.offsetParent.parentElement);
          if (isNaN(correctIndex)) {
            correctIndex = thisRow.getTargetIdx(args.target.parentElement);
          }
          args.dropIndex = correctIndex;
          droppedRecord = thisRow.droppedRecord = grid.getCurrentViewRecords()[args.dropIndex];
        }
        if (droppedRecord?.parentItem || thisRow.dropPosition === 'middleSegment') {
          const parentRecords = tObj.parentData;
          // const newParentIndex = parentRecords.indexOf(thisRow.draggedRecord);
          const newParentIndex = thisRow.draggedRecord.parentItem?.index || thisRow.draggedRecord.index
          if (newParentIndex !== -1) {
            parentRecords.splice(newParentIndex, 1);
          }
        }
        const recordIndex1 = thisRow.treeGridData.indexOf(droppedRecord);
        thisRow.dropAtTop(recordIndex1);
        console.log(thisRow.dropPosition);

        if (thisRow.dropPosition === 'bottomSegment') {
          if (!droppedRecord.hasChildRecords) {
            if (grid.parentIdMapping) {
              thisRow.treeData.splice(recordIndex1 + 1, 0, thisRow.draggedRecord.taskData);
            }
            thisRow.treeGridData.splice(recordIndex1 + 1, 0, thisRow.draggedRecord);
          }
          else {
            count = thisRow.getChildCount(droppedRecord, 0);
            if (grid.parentIdMapping) {
              thisRow.treeData.splice(recordIndex1 + count + 1, 0, thisRow.draggedRecord.taskData);
            }
            thisRow.treeGridData.splice(recordIndex1 + count + 1, 0, thisRow.draggedRecord);
          }
          if (isNullOrUndefined(droppedRecord.parentItem)) {
            delete draggedRecord.parentItem;
            draggedRecord.level = 0;
            if (grid.parentIdMapping) {
              draggedRecord[grid.parentIdMapping] = null;
            }
          }
          if (droppedRecord.parentItem) {
            const rec = thisRow.getChildrecordsByParentID(droppedRecord.parentUniqueID);
            const childRecords = rec[0].childRecords;
            const droppedRecordIndex = childRecords.indexOf(droppedRecord) + 1;
            childRecords.splice(droppedRecordIndex, 0, draggedRecord);
            draggedRecord.parentItem = droppedRecord.parentItem;
            draggedRecord.parentUniqueID = droppedRecord.parentUniqueID;
            if (grid.parentIdMapping) {
              draggedRecord[grid.parentIdMapping] = droppedRecord[grid.parentIdMapping];
              draggedRecord.parentItem = droppedRecord.parentItem;
              draggedRecord.level = droppedRecord.level;
            }
          }
          if (draggedRecord.hasChildRecords) {
            const level = 1;
            thisRow.updateChildRecordLevel(draggedRecord, level);
            thisRow.updateChildRecord(draggedRecord, recordIndex1 + count + 1);
          }
        }
        thisRow.dropMiddle(recordIndex1);
      }
      if (isNullOrUndefined(draggedRecord.parentItem)) {
        const parentRecords = tObj.parentData;
        // const newParentIndex = parentRecords.indexOf(thisRow.droppedRecord);
        const newParentIndex = thisRow.draggedRecord.parentItem?.index || thisRow.draggedRecord.index

        let nonRepeat = 0;
        parentRecords.filter((e: any) => {
          if (draggedRecord.uniqueID === e.uniqueID) {
            nonRepeat++;
          }
        });
        if (thisRow.dropPosition === 'bottomSegment' && nonRepeat === 0) {
          parentRecords.splice(newParentIndex + 1, 0, draggedRecord);
        }
        else if (thisRow.dropPosition === 'topSegment' && nonRepeat === 0) {
          parentRecords.splice(newParentIndex, 0, draggedRecord);
        }
      }
      tObj.rowDragAndDropModule.refreshGridDataSource();
    }
  }

}