import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, AfterViewInit, OnChanges } from '@angular/core';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { VirtualScrollService, TreeGridComponent, ColumnChooserService, ToolbarService, FreezeService, FilterService, SortService, RowDDService, SelectionService, EditSettingsModel, ToolbarItems, EditService, ContextMenuService, PageService, LoggerService, InfiniteScrollService, TreeGrid } from '@syncfusion/ej2-angular-treegrid';
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
  get form() {
    return this.colForm;
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
  scroll!: boolean
  number!: number
  contextMenuItems!: any[];
  show!: boolean
  @ViewChild('ejDialog') ejDialog!: DialogComponent;
  @ViewChild('chooseDialog') chooseDialog!: DialogComponent;
  @ViewChild('columnDialog') columnDialog!: DialogComponent;
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
  private headerContextMenuItems = [
    { text: 'EditCol', target: '.e-headercell', id: 'editCol' },
    { text: 'NewCol', target: '.e-headercell', id: 'newCol' },
    { text: 'DelCol', target: '.e-headercell', id: 'delCol' },
    { text: 'ChooseCol', target: '.e-headercell', id: 'chooseCol' },
    { text: 'FreezeCol', target: '.e-headercell', id: 'freezeCol' },
    { text: 'Filter', target: '.e-headercell', id: 'filter' },
    { text: 'MultiSorting', target: '.e-headercell', id: 'sorting' }

  ]
  private rowContextMenuItems = [
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
      columns: []
    }
    this.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Row' };
    // this.toolbarOptions = ['Add', 'Edit', 'Delete', 'Update', 'Cancel', ];
    this.contextMenuItems = [...this.headerContextMenuItems, 'Edit', 'Delete', 'AddRow', ...this.rowContextMenuItems];
    // this.contextMenuItems = [...this.headerContextMenuItems];
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
      if (['Filter', 'FreezeCol', 'MultiSorting', 'MultiSelect'].includes(e.innerHTML)) {
        const inputEl = document.createElement('input');
        inputEl.type = "checkbox";
        inputEl.id = e.id;
        inputEl.style.marginRight = '5px'
        e.prepend(inputEl)
      }
    })
  }

  private onEditCol(args: any) {
    this.columnDialog.show()
    this.colField = args.column.field
    this.headerText = args.column.headerText
    this.textAlign = args.column.textAlign
  }

  private onSortCol(args: any) {
    this.sort = args.event.target.checked;
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
    // const isChecked = args.event.target.checked;
    // this.scroll = isChecked;
    // this.number = isChecked ? 1 : 0;
    if (args.event.target.checked) {
      this.scroll = true
      this.number = 1
    }
    else {
      this.show = false
      this.number = 0
    }
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
        this.show = isChecked
        return;
      }
      case 'multiSelect': {
        this.selectOptions = { type: isChecked ? 'Multiple' : '' }
        return;
      }
      case 'cutRow': {
        this.grid.copy()
        this.row = this.rowIndex
        this.cut = true
        break;
      }
      case 'copyRow': {
        this.grid.copy()
        this.row = this.rowIndex;
        this.cut = false
        // let row = this.grid.flatData[this.rowIndex] as HTMLTableElement
        // console.log(row);
        // row.style.background = '#336c12';
        // // row.classList.add('bgcolor');
        break;
      }
      case 'pasteNext': {
        this.grid.flatData.splice(this.rowIndex + 1, 0, this.grid.flatData[this.row])
        if (this.row && this.cut) this.grid.flatData.splice(this.row, 1)
        this.grid.refreshColumns();
        break;
      }
      case 'pasteChild': {
        if (this.row && this.cut) {
          this.grid.flatData[args.rowInfo.rowData.parentItem.index].Crew?.push(this.grid.flatData[this.row])
          console.log(this.grid.flatData.splice(this.row, 1));

          this.grid.refresh()
        }
        else {
          this.grid.flatData[args.rowInfo.rowData.parentItem.index].Crew?.push(this.grid.flatData[this.row])
          this.grid.refresh()
        }
        break;
      }
    }

  }

  ngAfterViewInit() {
    // TreeGrid.prototype.getRowByIndex = getRowByIndex.bind(this)
    // function getRowByIndex(this: any, index: number) {
    //   console.log(this.grid.getDataRows().filter((e: any) => parseInt(e.getAttribute('aria-rowindex'), 10) === index)[0])
    //   return this.grid.getDataRows().filter((e: any) => parseInt(e.getAttribute('aria-rowindex'), 10) === index)[0] || {
    //     getAttribute: (data: boolean) => false
    //   };
    // }
    // console.log(TreeGrid)
    // console.log(this.grid)

  }
  onFiltering(e: any) {
    console.log(e);

  }
  onDrag(event: any) {
    console.log(event);
    // this.v = false;

  }
  sorting(args: any): void {
    console.log(args);
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
    // let input: any = document.getElementById('colName');
    // this.newColName = input.value;
    // var obj = { field: "priority", headerText: this.newColName, width: 120 };
    // this.grid.columns.push(obj as any);
    // this.grid.refreshColumns();
    // this.ejDialog.hide()
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
}
