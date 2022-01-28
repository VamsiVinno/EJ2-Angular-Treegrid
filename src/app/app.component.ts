import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, AfterViewInit, OnChanges } from '@angular/core';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { VirtualScrollService, TreeGridComponent, ColumnChooserService, ToolbarService, FreezeService, FilterService, SortService, RowDDService, SelectionService, EditSettingsModel, ToolbarItems, EditService, ContextMenuService, PageService, LoggerService, InfiniteScrollService } from '@syncfusion/ej2-angular-treegrid';
import { dataSource, virtualData } from './data';
import { DialogUtility } from '@syncfusion/ej2-popups';
import { FormBuilder } from '@angular/forms';
import { Alignments, Types } from './type.constant';
import { closest, createElement } from '@syncfusion/ej2-base';
import { COLUMNS } from './columns.constant';
import { GridService } from './grid.services';
import { CheckBoxComponent } from '@syncfusion/ej2-angular-buttons';
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
  data: Object[] | undefined;
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
  treeGridObj!: TreeGridComponent;
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
  private headerContextMenuItems = [
    { text: 'EditCol', target: '.e-headercell', id: 'editCol' },
    { text: 'NewCol', target: '.e-headercell', id: 'newCol' },
    { text: 'DelCol', target: '.e-headercell', id: 'delCol' },
    { text: 'ChooseCol', target: '.e-headercell', id: 'chooseCol' },
    { text: 'FreezeCol', target: '.e-headercell', id: 'freezeCol' },
    { text: 'FilterCol', target: '.e-headercell', id: 'filter' },
    { text: 'MultiSorting', target: '.e-headercell', id: 'sorting' }

  ]
  private rowContextMenuItems = [
    { text: 'AddNext', target: '.e-row', id: 'addNext' },
    { text: 'AddChild', target: '.e-row', id: 'addChild' },
    { text: 'MultiSelect', target: '.e-row', id: 'multiSelect' },
    { text: 'CopyRow', target: '.e-row', id: 'copyRow' },
    { text: 'CutRow', target: '.e-row', id: 'cutRow' },
    { text: 'PasteNext', target: '.e-row', id: 'pasteNext' },
    { text: 'PasteChild', target: '.e-row', id: 'pasteChild' },
   
  ]
  ngOnInit(): void {
    dataSource();
    this.data = virtualData.slice(0, 50);
    this.toolbar = ['ColumnChooser'];
    this.infiniteScrollSettings = { initialBlocks: 5 };
    this.sortSettings = {
      columns: [{ field: 'TaskID', direction: 'Ascending' },
      { field: 'FIELD1', direction: 'Ascending' }]
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
        inputEl.id = e.id;
        inputEl.style.marginRight = '5px'
        e.prepend(inputEl)
      }
    })
    // if (args.event.target.className == 'e-headercelldiv' || args.event.target.className == 'e-headertext') {
    //   let addRow = document.getElementById('_gridcontrol_cmenu_AddRow')
    //   console.log(addRow);
    // }
  }

  private onEditCol(args: any) {
    this.columnDialog.show()
    this.colField = args.column.field
    this.headerText = args.column.headerText
    this.textAlign = args.column.textAlign.toLowerCase()
    this.dataType = args.column.type
  }

  private onSortCol(args: any) {
    let checked = this.onClickCheckBox(args)
    this.sort = checked
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
    // this.v=false
    // const isChecked = args.event.target.children[0].checked
    // this.scroll = isChecked;
    // this.number = isChecked ? 1 : 0;
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
        let checked = this.onClickCheckBox(args)
        this.show = checked
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
        let checked = this.onClickCheckBox(args)
        this.selectOptions = { type: checked ? 'Multiple' : 'Single' }
        return;
      }
      case 'cutRow': {
        this.copyRow(args)
        this.row = this.rowIndex

        this.cut = true
        break;
      }
      case 'copyRow': {
        console.log(args.rowInfo);

        this.copyRow(args)
        this.row = this.rowIndex

        this.cut = false
        break;
      }
      case 'pasteNext': {
        if (this.row) {
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
          this.grid.flatData[args.rowInfo.rowData.parentItem.index]?.Crew?.push(this.grid.flatData[this.row])
          this.grid.refresh()
          if (this.cut) {
            this.grid.flatData.splice(this.row, 1)
          }
          this.grid.refreshColumns()
        }
        break;
      }
    }

  }

  ngAfterViewInit() {


  }
  onFiltering(e: any) {
    console.log(e);

  }
  onDrag(event: any) {
    console.log(event);
    // this.v = false;

  }
  onClickCheckBox(args: any) {
    return args.event.target.children[0].checked = !args.event.target.children[0].checked
  }
  copyRow(args: any) {
    let row = args.rowInfo.row
    row.style.background = 'pink';
    this.grid.copy()
  }
  sorting(args: any): void {
    console.log(args);
    if (args.requestType === 'sorting') {
      for (let columns of this.grid.columns) {
        for (let sortcolumns of this.sortSettings['columns']) {
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
        this.TMID.checked = state; break;
      case 'FIELD4':
        this.Stint.checked = state; break;
    }
  }

  // Multi sorting No working
  onClick(event: any) {
    const { checked, value } = event.target;
    if (checked) {
      this.grid.sortByColumn(value, 'Ascending', true);
    } else {
      this.grid.grid.removeSortColumn(value);
    }

    // this.columns.map(col => {
    //   if (col.field === event.target.value && event.target.checked) {
    //     console.log(event.target.value);
    //     console.log(this.grid);
    //     this.grid.sortByColumn(col.field, 'Ascending', true);
    //   }
    //   else {
    //     this.grid.grid.removeSortColumn(col.field);
    //   }

    // })

  }
  onClick1(e: any): void {
    if (this.PlayerJersey.checked) {
      this.grid.sortByColumn('TaskID', 'Ascending', true);
    } else {
      this.grid.grid.removeSortColumn('TaskID');
    }

  }
  onClick2(e: any): void {
    if (this.PlayerName.checked) {
      this.grid.sortByColumn('FIELD1', 'Ascending', true);
    } else {
      this.grid.grid.removeSortColumn('FIELD1');
    }

  }
  onClick3(e: any): void {
    if (this.Year.checked) {
      this.grid.sortByColumn('FIELD2', 'Ascending', true);
    } else {
      this.grid.grid.removeSortColumn('FIELD2');
    }

  }
  onClick4(e: any): void {
    if (this.Stint.checked) {
      this.grid.sortByColumn('FIELD3', 'Ascending', true);
    } else {
      this.grid.grid.removeSortColumn('FIELD3');
    }

  }
  onClick5(e: any): void {
    if (this.TMID.checked) {
      this.grid.sortByColumn('FIELD4', 'Ascending', true);
    } else {
      this.grid.grid.removeSortColumn('FIELD4');
    }

  }


  // if (args.item.text === 'Edit') {
  //   if (this.grid.getSelectedRecords().length) {
  //     this.grid.startEdit();
  //   } else {
  //     alert('Select any row');
  //   }
  // }

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
    this.gridService.createColumn(this.grid, this.ejDialog)
  }
  onCancel() {
    this.gridService.cancelDialog(this.ejDialog)
  }
  onEditCancel() {
    this.gridService.cancelDialog(this.columnDialog)
  }
  onChooseColumn(event: any) {
    const { columns, grid, columnsCopy } = this;
    this.gridService.chooseColumn(event, { grid, columnsCopy, columns });

  }
  onAddRow() {
    if (this.addChildIndex >= 0) {
      this.grid.flatData[this.addChildIndex]?.Crew?.push(this.rowForm.value)
      this.grid.refresh()
      this.addRowDialog.hide()
    }
    else {
      this.grid.flatData.splice(this.rowIndex + 1, 0, this.rowForm.value)
      this.grid.refreshColumns()
      this.addRowDialog.hide()
    }
  }
  onCancelRow() {
  }
}
