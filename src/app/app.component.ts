import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, AfterViewInit, OnChanges } from '@angular/core';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { VirtualScrollService, TreeGridComponent, ColumnChooserService, ToolbarService, FreezeService, FilterService, SortService, RowDDService, SelectionService, EditSettingsModel, ToolbarItems, EditService, ContextMenuService, PageService, LoggerService, InfiniteScrollService, TreeGrid, AggregateService } from '@syncfusion/ej2-angular-treegrid';
import { dataSource, virtualData } from './data';
import { DialogUtility } from '@syncfusion/ej2-popups';
import { FormBuilder } from '@angular/forms';
import { Alignments, Types } from './constants.constant'
import { COLUMNS } from './constants.constant';
import { CheckBoxComponent } from '@syncfusion/ej2-angular-buttons';
import { ColumnMenu, RowMenu } from './constants.constant';
import { dropRows, isNullOrUndefined } from './utils/grid.util';
import { cancelDialog, chooseColumn, createColumn, editColumn } from './utils/services.util';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [VirtualScrollService, ColumnChooserService, ToolbarService, FreezeService, FilterService, SortService,
    RowDDService, SelectionService, EditService, ContextMenuService, PageService, InfiniteScrollService,AggregateService]
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
  constructor(private fb: FormBuilder) { }
  @ViewChild('grid') grid!: TreeGrid;
  newColName!: any
  hideDialog: any = () => {
    this.ejDialog.hide();
  }
  columns = COLUMNS
  columnsCopy = [...this.columns]
  data!: any[];
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
  dataCopy!: any
  show!: boolean
  dummyData: any
  @ViewChild('ejDialog') ejDialog!: DialogComponent;
  @ViewChild('chooseDialog') chooseDialog!: DialogComponent;
  @ViewChild('columnDialog') columnDialog!: DialogComponent;
  @ViewChild('addRowDialog') addRowDialog!: DialogComponent
  @ViewChild('PlayerJersey') PlayerJersey!: CheckBoxComponent;
  @ViewChild('PlayerName') PlayerName!: CheckBoxComponent;
  @ViewChild('Year') Year!: CheckBoxComponent;
  @ViewChild('Stint') Stint!: CheckBoxComponent;
  @ViewChild('TMID') TMID!: CheckBoxComponent;
  @ViewChild('.e-table') table!: ElementRef;
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
  private checked!: boolean
  private addChild!: boolean
  allowDragandDrop!: boolean
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
        if (inputEl.id == 'freezeColCheckbox') {
          inputEl.checked = this.checked
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
    this.sort = args.event.target.checked
  }
  private onDelCol(args: any) {
    const columnIndex = this.grid.columns.findIndex((value: any) => value.field == args.column.field);
    if (columnIndex === -1) return;
    DialogUtility.confirm('Column is deleted')
    this.grid.columns.splice(columnIndex, 1);
    this.grid.refreshColumns();
  }
  onFreezeCol(args: any) {
    const isChecked = args.event.target.checked
    this.v = !isChecked
    this.scroll = isChecked;
    this.number = isChecked ? args.column.index + 1 : 0;
    this.checked = isChecked
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
      case 'freezeCol': {
        return this.onFreezeCol(args);
      }
      case 'filter': {
        this.show = isChecked
        return;
      }
      case 'addNext': {
        this.addRowDialog.show()
        this.addChild = false
        break;
      }
      case 'addChild': {
        this.addChildIndex = args.rowInfo.rowData.parentItem?.index
        this.row = this.rowIndex
        this.addRowDialog.show()
        this.addChild = true
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
          let row = this.grid.flatData[this.rowIndex] as any;
          if (parentIndex >= 0) {
            row.parentItem.taskData.Crew?.push(this.grid.flatData[this.row]);
          }
          else {
            row.Crew.push(this.grid.flatData[this.row])
          }
          this.grid.refresh()
          if (this.cut) {
            this.grid.refreshColumns()
            this.grid.refresh()
            this.grid.flatData.splice(this.row, 1)
            const index = row.parentItem.index
            let cutIndex = this.data![index].Crew.findIndex((e: any) => {
              return e.TaskID === row.TaskID
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
    setTimeout(() => {
      (this.grid.rowDragAndDropModule as any).__proto__.dropRows = dropRows.bind(this);
    }, 200)
  }
  onDragandDrop(event: any) {
    let isChecked = event.target.checked
    this.allowDragandDrop = isChecked
    this.v = !isChecked
    this.scroll = isChecked;
    // (this.grid.rowDragAndDropModule as any).__proto__.dropRows = this.dropRows.bind(this);
  }
  onDrag(event: any) {

  }
  onDrop(event: any) {
  }
  copyRow(args: any) {
    let row = args.rowInfo.row
    row.style.background = 'pink';
    this.grid.copy()
  }
  sorting(args: any): void {
    if (args.requestType === 'sorting') {
      for (let columns of this.grid.getColumns()) {
        for (let sortcolumns of this.grid.sortSettings.columns || []) {
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
  onClick(event: any, ele?: any) {
    const { checked, value } = ele;
    if (checked) {
      this.grid.sortByColumn(value, 'Ascending', true);
    } else {
      this.grid.grid.removeSortColumn(value);
    }
  }
  onEditColumn() {
    const { grid, form, customAttributes, colField, columnDialog } = this;
    editColumn({ grid, form, customAttributes, colField, columnDialog })
    this.customAttributes = {
      style: {
        background: '',
        color: '',
        'font-size': ''
      }
    };
  }
  onCreateColumn() {
   createColumn(this.grid, this.ejDialog, this.columnsCopy)
  }
  onCancel() {
    cancelDialog(this.ejDialog)
  }
  onEditCancel() {
    cancelDialog(this.columnDialog)
  }
  onChooseColumn(event: any) {
    const { grid, columnsCopy } = this;
    chooseColumn(event, { grid, columnsCopy });
  }
  pushRow(index: number) {
    (this.grid.flatData[index] as any)?.taskData.Crew?.push(this.rowForm.value);
  }
  dropIndex!: number
  onAddRow() {
    if (this.addChildIndex >= 0 && this.addChild) {
      this.pushRow(this.addChildIndex)
      this.grid.refresh()
      this.addRowDialog.hide()
      this.rowForm.reset()
    }
    else if (this.row >= 0 && this.addChild) {
      (this.grid.flatData[this.row] as any).Crew?.push(this.rowForm.value)
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
   cancelDialog(this.addRowDialog)
  }
}
