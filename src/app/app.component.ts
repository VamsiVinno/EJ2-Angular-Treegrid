import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, AfterViewInit, OnChanges } from '@angular/core';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { VirtualScrollService, TreeGridComponent, ColumnChooserService, ToolbarService, FreezeService, FilterService, SortService, RowDDService, SelectionService, EditSettingsModel, ToolbarItems, EditService, ContextMenuService, PageService } from '@syncfusion/ej2-angular-treegrid';
import { dataSource, virtualData } from './data';
import { Dialog } from '@syncfusion/ej2-popups';
import { DialogUtility } from '@syncfusion/ej2-popups';
import { FormBuilder } from '@angular/forms';
import { Types } from './type.constant';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [VirtualScrollService, ColumnChooserService, ToolbarService, FreezeService, FilterService, SortService,
    RowDDService, SelectionService, EditService, ContextMenuService, PageService]
})
export class AppComponent implements OnInit {
  colForm = this.fb.group({
    name: [],
    size: [],
    fontColor: [],
    bgColor: [],
    type: []
  })
  get form() {
    return this.colForm;
  }

  constructor(private fb: FormBuilder) { }

  @ViewChild('grid') grid!: any;
  newColName!: any
  public hideDialog: any = () => {
    this.ejDialog.hide();
  }

  // columnNames = ['Player Jersey', 'Player Name', 'Year', 'Stint',]
  columns = [

    {
      field: 'TaskID',
      headerText: 'Player Jersey',
      checked: true
    },
    {
      field: 'FIELD1',
      headerText: 'Player Name',
      checked: true
    },
    {
      field: 'FIELD2',
      headerText: 'Year',
      checked: true
    },
    {
      field: 'FIELD3',
      headerText: 'Stint',
      checked: true
    },
    {
      field: 'FIELD4',
      headerText: 'TMID',
      checked: true
    }

  ];
  columnsCopy = [...this.columns]
  public data: Object[] | undefined;
  public toolbar: string[] | undefined;
  public infiniteScrollSettings!: Object;
  public selectOptions!: Object;
  public toolbarOptions!: any[];
  public editSettings!: EditSettingsModel;
  v = true;
  public contextMenuItems!: any[];
  public treeGridObj!: TreeGridComponent;
  show!: boolean
  @ViewChild('ejDialog') ejDialog!: DialogComponent;
  @ViewChild('chooseDialog') chooseDialog!: DialogComponent;
  @ViewChild('columnDialog') columnDialog!: DialogComponent;
  public types = Types
  public targetElement!: HTMLElement;
  public rowIndex!: number;
  public cellIndex!: number;
  public placeholder: string = 'Select games';

  public selectAllText!: string
  public field = { text: 'headerText', value: 'field' };
  public dialogVisibility: boolean = false;
  private colField!: string;
  public customAttributes!: Object;
  private headerContextMenuItems = [
    { text: 'EditCol', target: '.e-headercell', id: 'editCol' },
    { text: 'NewCol', target: '.e-headercell', id: 'newCol' },
    { text: 'DelCol', target: '.e-headercell', id: 'delCol' },
    { text: 'ChooseCol', target: '.e-headercell', id: 'chooseCol' },
    { text: 'FreezeCol', target: '.e-headercell', id: 'freezeCol' },
    { text: 'Fiter', target: '.e-headercell', id: 'filter' }

  ]
  private rowContextMenuItems = [
    // { text: 'AddRow', target: '.e-row', id: 'addNext' },
    // { text: 'AddChild', target: '.e-row', id: 'addChild' },
    // { text: 'Delete', target: '.e-row', id: 'delRow' },
    // { text: 'Edit', target: '.e-row', id: 'editRow' },
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

    this.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Row' };
    // this.toolbarOptions = ['Add', 'Edit', 'Delete', 'Update', 'Cancel', ];
    this.contextMenuItems = [...this.headerContextMenuItems, 'SortAscending', 'SortDescending', 'Edit', 'Delete', 'AddRow', ...this.rowContextMenuItems];

    this.show = false;
    this.customAttributes = {
      class: 'customcss', style: {
        background: '#000'
      }
    };
  }

  contextMenuOpen(args: any): void {
    this.rowIndex = args.rowInfo.rowIndex;
    this.cellIndex = args.rowInfo.cellIndex;
  }
  contextMenuClick(args?: any): void {
    if (args.item.id === 'editCol') {
      let colObj = this.form.value
      this.columnDialog.show()
      console.log(args.column.field);
      this.colField = args.column.field
      // const column = this.grid.getColumnByField(args.column.field);
      // column.headerText = colObj.name;
      // this.grid.refreshColumns()
    }
    if (args.item.id === 'newCol') {
      this.ejDialog.show();
    }
    if (args.item.id === 'delCol') {
      this.grid.columns.filter((i: any, x: any) => {
        if (i.field == args.column.field) {
          DialogUtility.confirm('Column is deleted')
          this.grid.columns.splice(x, 1);
        }
      });
      this.grid.refreshColumns();
    }
    if (args.item.id === 'chooseCol') {
      this.chooseDialog.show()
    }
    if (args.item.id === 'filter') {
      this.show = true
    }
    if (args.item.id === 'multiSelect') {

      this.selectOptions = { type: 'Multiple' }
    }
    if (args.item.id === 'multiSelect') {

      this.selectOptions = { type: 'Multiple' }
    }
    if (args.item.id === 'copyRow') {
      this.grid.copy()

    }
    if (args.item.id === 'pasteNext') {
      // this.selectOptions = { type: 'Multiple', mode: 'Cell', cellSelectionMode: 'Box' };
      var rowIndex = args.rowInfo.rowIndex;
      var cellIndex = args.rowInfo.cellIndex;
      var copyContent = this.grid.clipboardModule.copyContent;
      this.grid.paste(copyContent, rowIndex, cellIndex);
    }

  }
  ngAfterViewInit() {
    console.log(this.grid);
  }
  onFiltering(e: any) {
    console.log(e);

  }
  onDrag(event: any) {
    console.log(event);
    this.v = false;
  }
  onEditColumn() {
    console.log(this.colField);
    console.log(this.grid.columns);
    let colObj = this.form.value
    this.grid.columns.map((e: any) => {
      if (e.field == this.colField) {
        e.headerText = colObj.name;
        e.type = colObj.type;
        console.log(e);

        e.customAttributes = this.customAttributes

        this.grid.refreshColumns();
        this.columnDialog.hide()
      }
    })
  }
  onCreateColumn() {
    let input: any = document.getElementById('colName');
    this.newColName = input.value;
    var obj = { field: "priority", headerText: this.newColName, width: 120 };
    this.grid.columns.push(obj as any);
    this.grid.refreshColumns();
    this.ejDialog.hide()
  }

  onCancel() {
    this.ejDialog.hide()
  }
  onChooseColumn(event: any) {
    let checkedColumns = []
    checkedColumns.push(event.target.value)
    console.log(event.target.checked);
    if (event.target.checked == false) {
      checkedColumns.map(e => {
        this.columns.map(f => {
          if (e === f.field) {
            let index = this.columns.indexOf(f)
            this.columns.splice(index, 1)
          }
        })
      })
    }
    if (event.target.checked) {
      checkedColumns.map(e => {
        this.columnsCopy.map(f => {
          if (e === f.field) {
            this.columns.push(f)
          }
        })
      })
    }
  }
}
