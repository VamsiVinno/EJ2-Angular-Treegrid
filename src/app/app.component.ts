import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, AfterViewInit, OnChanges } from '@angular/core';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { VirtualScrollService, TreeGridComponent, ColumnChooserService, ToolbarService, FreezeService, FilterService, SortService, RowDDService, SelectionService, EditSettingsModel, ToolbarItems, EditService, ContextMenuService, PageService, LoggerService, InfiniteScrollService, TreeGrid } from '@syncfusion/ej2-angular-treegrid';
import { dataSource, virtualData } from './data';
import { DialogUtility } from '@syncfusion/ej2-popups';
import { FormBuilder } from '@angular/forms';
import { Alignments, Types } from './type.constant';
import { COLUMNS } from './columns.constant';
import { GridService } from './grid.services';
import { CheckBoxComponent } from '@syncfusion/ej2-angular-buttons';
import { ColumnMenu, RowMenu } from './menu.constant';
import { CacheAdaptor, DataManager, ODataAdaptor, UrlAdaptor, WebApiAdaptor, WebMethodAdaptor } from '@syncfusion/ej2-data';
import { isNullOrUndefined } from '@syncfusion/ej2-base/src/util';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [VirtualScrollService, ColumnChooserService, ToolbarService, FreezeService, FilterService, SortService,
    RowDDService, SelectionService, EditService, ContextMenuService, PageService, InfiniteScrollService]
})
export class AppComponent implements OnInit, AfterViewInit {
  colForm = this.fb.group({
    name: [],
    size: [],
    fontColor: [],
    bgColor: [],
    type: [],
    alignment: []
  })
  rowForm = this.fb.group({
    TaskID: [],
    FIELD1: [],
    FIELD2: [],
    FIELD3: [],
    FIELD4: []
  })
  get form() {
    return this.colForm;
  }
  get rowform() {
    return this.rowForm
  }
  constructor(private fb: FormBuilder, private gridService: GridService) { }

  @ViewChild('grid') grid!: any;
  newColName!: any
  hideDialog: any = () => {
    this.ejDialog.hide();
  }
  columns = COLUMNS
  columnsCopy = [...this.columns]
  data: any[] | undefined;
  toolbar: string[] | undefined;
  infiniteScrollSettings!: Object;
  selectOptions!: Object;
  toolbarOptions!: any[];
  editSettings!: EditSettingsModel;
  v = true;
  dataType!: string
  scroll!: boolean
  number!: number
  contextMenuItems!: any[];
  show!: boolean
  @ViewChild('ejDialog') ejDialog!: DialogComponent;
  @ViewChild('chooseDialog') chooseDialog!: DialogComponent;
  @ViewChild('columnDialog') columnDialog!: DialogComponent;
  @ViewChild('addRowDialog') addRowDialog!: DialogComponent
  @ViewChild('PlayerJersey') PlayerJersey!: CheckBoxComponent;
  @ViewChild('PlayerName') PlayerName!: CheckBoxComponent;
  @ViewChild('Year') Year!: CheckBoxComponent;
  @ViewChild('Stint') Stint!: CheckBoxComponent;
  @ViewChild('TMID') TMID!: CheckBoxComponent;
  types = Types
  alignments = Alignments
  targetElement!: HTMLElement;
  rowIndex!: number;
  cellIndex!: number;
  placeholder: string = 'Select games';
  selectAllText!: string
  field = { text: 'headerText', value: 'field' };
  dialogVisibility: boolean = false;
  private colField!: string;
  customAttributes!: any;
  headerText!: string;
  textAlign!: string
  sort!: boolean;
  private row!: number;
  sortSettings!: any;
  cut!: boolean
  private addChildIndex!: number
  private headerContextMenuItems = ColumnMenu
  private rowContextMenuItems = RowMenu
  private checked!:boolean
  ngOnInit(): void {
    dataSource();
    this.data = virtualData.slice(0, 50);
    this.toolbar = ['ColumnChooser'];
    this.infiniteScrollSettings = { initialBlocks: 5 };
    this.sortSettings = {
      columns: []
    }
    this.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Row' };
    this.contextMenuItems = [...this.headerContextMenuItems, 'Edit', 'Delete', ...this.rowContextMenuItems];
    this.show = false;
    this.customAttributes = {
      style: {
        background: '',
        color: '',
        'font-size': ''
      }
    };

  }
  contextMenuOpen(args: any): void {
    this.rowIndex = args.rowInfo.rowIndex;
    this.cellIndex = args.rowInfo.cellIndex;
    let list = document.getElementById('_gridcontrol_cmenu')
    let arr = Array.from(list?.children!)
    arr.forEach(e => {
      if (['FilterCol', 'FreezeCol', 'MultiSorting', 'MultiSelect'].includes(e.innerHTML)) {
        const inputEl = document.createElement('input');
        inputEl.type = "checkbox";
        inputEl.id = e.id + 'Checkbox';
        inputEl.style.marginRight = '5px'
        if(inputEl.id=='freezeColCheckbox'){
          inputEl.checked=this.checked
        }
        e.prepend(inputEl)
      }
    })
  }

  private onEditCol(args: any) {
    this.columnDialog.show()
    this.colField = args.column.field
    this.headerText = args.column.headerText
    this.textAlign = args.column.textAlign.toLowerCase()
    this.dataType = args.column.type
  }

  private onSortCol(args: any) {
    // let checked = this.onClickCheckBox(args)
    this.sort = args.event.target.checked
  }
  private onDelCol(args: any) {
    const columnIndex = this.grid.columns.findIndex((value: any) => value.field == args.column.field);
    if (columnIndex === -1) return;
    DialogUtility.confirm('Column is deleted')
    this.grid.columns.splice(columnIndex, 1);
    this.grid.refreshColumns();
  }

  // Not Working
  onFreezeCol(args: any) {
    console.log(args.column.index);
    
    const isChecked = args.event.target.checked
    this.v = !isChecked
    this.scroll = isChecked;
    this.number = isChecked ? args.column.index+1 : 0;
    this.checked=isChecked
  }


  contextMenuClick(args?: any): void {
    const isChecked = Boolean(args.event.target.checked);
    switch (args.item.id) {
      case 'editCol': {
        return this.onEditCol(args);
      }
      case 'sorting': {

        return this.onSortCol(args);
      }
      case 'newCol': {
        this.ejDialog.show();
        break;
      }
      case 'delCol': {
        return this.onDelCol(args);
      }
      case 'chooseCol': {
        this.chooseDialog.show()
        break;
      }
      // Not Working
      case 'freezeCol': {
        return this.onFreezeCol(args);
      }
      case 'filter': {
        // let checked = this.onClickCheckBox(args)
        this.show = isChecked
        return;

      }
      case 'addNext': {
        this.addRowDialog.show()
        break;
      }
      case 'addChild': {
        this.addChildIndex = args.rowInfo.rowData.parentItem?.index
        this.addRowDialog.show()

        break;
      }
      case 'multiSelect': {
        this.selectOptions = { type: isChecked ? 'Multiple' : 'Single' }
        return;
      }
      case 'cutRow': {
        this.copyRow(args)
        this.row = this.rowIndex
        this.cut = true
        break;
      }
      case 'copyRow': {
        this.copyRow(args)
        this.row = this.rowIndex
        this.cut = false
        break;
      }
      case 'pasteNext': {
        if (this.row >= 0) {
          this.grid.flatData.splice(this.rowIndex + 1, 0, this.grid.flatData[this.row])
          if (this.cut) {
            this.grid.flatData.splice(this.row, 1)
          }
          this.grid.refreshColumns()
        }
        break;
      }
      case 'pasteChild': {
        if (this.row) {
          let parentIndex = args.rowInfo.rowData.parentItem?.index
          if (parentIndex >= 0) {
            this.grid.flatData[this.rowIndex].parentItem.taskData.Crew?.push(this.grid.flatData[this.row]);
          }
          else {
            this.grid.flatData[this.rowIndex].Crew.push(this.grid.flatData[this.row])
          }
          this.grid.refresh()
          if (this.cut) {
            this.grid.refreshColumns()
            this.grid.refresh()
            this.grid.flatData.splice(this.row, 1)
            const index = this.grid.flatData[this.row].parentItem.index
            let cutIndex = this.data![index].Crew.findIndex((e: any) => {
              return e.TaskID === this.grid.flatData[this.row].TaskID
            });
            if (cutIndex == -1) return
            this.data![index].Crew.splice(cutIndex, 1)
          }
          this.grid.refreshColumns()
        }
        break;
      }
    }

  }

  ngAfterViewInit() {
    TreeGrid.prototype.getRowByIndex = getRowByIndex.bind(this)
    function getRowByIndex(this: any, index: number) {
      return this.grid.getDataRows().filter((e: any) => e.rowIndex === index)[0] || {
        getAttribute: (data: boolean) => false
      };
    }
    console.log(this.grid);
    setTimeout(() => {
      this.grid.rowDragAndDropModule.__proto__.dropRows = this.dropRows.bind(this);
    })
  }



  dropRows(this: any, args: any, isByMethod: any) {
    console.log(args);
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
          args.dropIndex = args.dropIndex === args.fromIndex ? thisRow.getTargetIdx(args.target.parentElement) : args.dropIndex;
          thisRow.droppedRecord = tObj.getCurrentViewRecords().find((e: any) => e.TaskID === args.dropIndex);
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
                  thisRow.deleteDragRow();
              }
              if (thisRow.draggedRecord === thisRow.droppedRecord) {
                  let correctIndex = thisRow.getTargetIdx(args.target.offsetParent.parentElement);
                  if (isNaN(correctIndex)) {
                      correctIndex = thisRow.getTargetIdx(args.target.parentElement);
                  }
                  args.dropIndex = correctIndex;
                  droppedRecord = thisRow.droppedRecord = grid.getCurrentViewRecords()[args.dropIndex];
              }
              if (droppedRecord.parentItem || thisRow.dropPosition === 'middleSegment') {
                  const parentRecords = tObj.parentData;
                  const newParentIndex = parentRecords.indexOf(thisRow.draggedRecord);
                  if (newParentIndex !== -1) {
                      parentRecords.splice(newParentIndex, 1);
                  }
              }
              const recordIndex1 = thisRow.treeGridData.indexOf(droppedRecord);
              thisRow.dropAtTop(recordIndex1);
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
              const newParentIndex = parentRecords.indexOf(thisRow.droppedRecord);
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

    console.log('thisRow ->', this);
}








  onDrag(event: any) {
    // console.log(event);
    // this.v = false;
    // console.log(event.originalEvent.event.preventDefault());
    var a = event.data[0].index;
    //  var b = this.obj2;
    //  this.obj1 = b;
    //  this.obj2 = a;
  }
  onDragStart(event: any) {
    // this.v = false;
    // console.log(event.originalEvent);
    var a = event.data[0].index;
    //  var b = this.obj2;
    //  this.obj1 = b;
    //  this.obj2 = a;
  }
  onDrop(event:any){
    // console.log(event);
    // var a = this.grid.flatData[event.fromIndex]
    //  var b = this.grid.flatData[event.dropIndex]
    //  this.grid.flatData[event.fromIndex]= b;
    //  this.grid.flatData[event.dropIndex]= a;
    // this.grid.refreshColumns()
  }
  // onClickCheckBox(args: any) {
  //   return args.event.target.children[0].checked = !args.event.target.children[0].checked
  // }
  copyRow(args: any) {
    let row = args.rowInfo.row
    row.style.background = 'pink';
    this.grid.copy()
  }
  sorting(args: any): void {
    if (args.requestType === 'sorting') {
      for (let columns of this.grid.getColumns()) {
        for (let sortcolumns of this.grid.sortSettings.columns) {
          if (sortcolumns.field === columns.field) {
            this.check(sortcolumns.field, true); break;
          } else {
            this.check(columns.field, false);
          }
        }
      }
    }

  }
  check(field: string, state: boolean): void {
    switch (field) {
      case 'TaskID':
        this.PlayerJersey.checked = state; break;
      case 'FIELD1':
        this.PlayerName.checked = state; break;
      case 'FIELD2':
        this.Year.checked = state; break;
      case 'FIELD3':
        this.Stint.checked = state; break;
      case 'FIELD4':
        this.TMID.checked = state; break;
    }
  }

  // Multi sorting No working
  onClick(event: any, ele?: any) {
    const { checked, value } = ele;
    if (checked) {
      this.grid.sortByColumn(value, 'Ascending', true);
    } else {
      this.grid.grid.removeSortColumn(value);
    }
  }
  onEditColumn() {
    let colObj = this.form.value
    this.grid.columns.map((e: any) => {
      if (e.field == this.colField) {
        if (colObj.name) {
          e.headerText = colObj.name;
        }
        if (colObj.alignment) {
          e.textAlign = colObj.alignment
        }
        this.customAttributes.style.background = colObj.bgColor;
        this.customAttributes.style.color = colObj.fontColor;
        this.customAttributes.style['font-size'] = colObj.size + 'px'
        e.customAttributes = this.customAttributes
        switch (colObj.type) {
          case 'string': {
            this.grid.flatData.map((data: any) => {
              data[this.colField] = String(data[this.colField]) || "none"
            })
            break;
          }
          case 'number': {
            this.grid.flatData.map((data: any) => {
              data[this.colField] = parseInt(data[this.colField]) || 0;
            })
            break;
          }
          case 'date': {
            this.grid.flatData.map((data: any) => {
              data[this.colField] = new Date(9, 11, 24)
            })
            break;
          }
          case 'boolean': {
            this.grid.flatData.map((data: any) => {
              data[this.colField] = true
            })
            break;
          }
        }

        this.grid.refreshColumns();
        this.columnDialog.hide()
        this.customAttributes = {
          style: {
            background: '',
            color: '',
            'font-size': ''
          }
        };
      }
    })
  }
  onCreateColumn() {
    this.gridService.createColumn(this.grid, this.ejDialog, this.columnsCopy)
  }
  onCancel() {
    this.gridService.cancelDialog(this.ejDialog)
  }
  onEditCancel() {
    this.gridService.cancelDialog(this.columnDialog)
  }
  onChooseColumn(event: any) {
    const { grid, columnsCopy } = this;
    this.gridService.chooseColumn(event, { grid, columnsCopy });
  }
  onAddRow() {
    if (this.addChildIndex >= 0) {
      this.grid.flatData[this.addChildIndex]?.Crew?.push(this.rowForm.value)
      this.grid.refresh()
      this.addRowDialog.hide()
      this.rowForm.reset()
    }
    else {
      this.grid.flatData.splice(this.rowIndex + 1, 0, this.rowForm.value)
      this.grid.refreshColumns()
      this.addRowDialog.hide()
      this.rowForm.reset()
    }
  }
  onCancelRow() {
  }
}
