import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, AfterViewInit, OnChanges } from '@angular/core';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { VirtualScrollService, TreeGridComponent, ColumnChooserService, ToolbarService, FreezeService, FilterService, SortService, RowDDService, SelectionService, EditSettingsModel, ToolbarItems, EditService, ContextMenuService, PageService, LoggerService } from '@syncfusion/ej2-angular-treegrid';
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
    RowDDService, SelectionService, EditService, ContextMenuService, PageService]
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
  public hideDialog: any = () => {
    this.ejDialog.hide();
  }
  columns = COLUMNS
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
  @ViewChild('PlayerJersey') public PlayerJersey!: CheckBoxComponent;
  @ViewChild('PlayerName') public PlayerName!: CheckBoxComponent;
  @ViewChild('Year') public Year!: CheckBoxComponent;
  @ViewChild('Stint') public Stint!: CheckBoxComponent;
  @ViewChild('TMID') public TMID!: CheckBoxComponent;
  public types = Types
  public alignments = Alignments
  public targetElement!: HTMLElement;
  public rowIndex!: number;
  public cellIndex!: number;
  public placeholder: string = 'Select games';
  public selectAllText!: string
  public field = { text: 'headerText', value: 'field' };
  public dialogVisibility: boolean = false;
  private colField!: string;
  public customAttributes!: any;
  public headerText!: string;
  public textAlign!: string
  public sort!: boolean;
  private row!: number;
  public sortSettings!: Object
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
      columns: [{ field: 'TaskID', direction: 'Ascending' },
      { field: 'FIELD1', direction: 'Ascending' }]
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
    arr.map(e => {
      if (e.innerHTML === 'Filter' || e.innerHTML === 'FreezeCol' || e.innerHTML === 'MultiSorting' || e.innerHTML == 'MultiSelect') {
        const newItem = document.createElement('input');
        newItem.type = "checkbox";
        newItem.id = e.id;
        newItem.style.marginRight = '5px'
        e.prepend(newItem)
      }
    })
  }
  contextMenuClick(args?: any): void {
    switch (args.item.id) {
      case 'editCol': {
        this.columnDialog.show()
        this.colField = args.column.field
        this.headerText = args.column.headerText
        this.textAlign = args.column.textAlign
        break;
      }
      case 'sorting': {
        if (args.event.target.checked) {
          this.sort = true
        }
        else this.sort = false
        break;
      }
      case 'newCol': {
        this.ejDialog.show();
        break;
      }
      case 'delCol': {
        this.grid.columns.filter((i: any, x: any) => {
          
          if (i.field == args.column.field) {
            DialogUtility.confirm('Column is deleted')
            this.grid.columns.splice(x, 1);
          }
        });
        this.grid.refreshColumns();
        break;
      }
      case 'chooseCol': {
        this.chooseDialog.show()
        break;
      }
      case 'filter': {
        if (args.event.target.checked) {
          this.show = true
        }
        else this.show = false
        break;
      }
      case 'multiSelect': {
        if (args.event.target.checked) {
          this.selectOptions = { type: 'Multiple' }
        }
        else this.selectOptions = { type: '' }

        break;
      }
      case 'copyRow': {
        this.grid.copy()
        this.row = this.rowIndex
        // let row = this.grid.flatData[this.rowIndex] as HTMLTableElement
        // console.log(row);
        // row.style.background = '#336c12';
        // // row.classList.add('bgcolor');
        break;
      }
      case 'pasteNext': {
        // this.selectOptions = { type: 'Multiple', mode: 'Cell', cellSelectionMode: 'Box' };
        //   var rowIndex = args.rowInfo.rowIndex;
        //   var cellIndex = args.rowInfo.cellIndex;
        var copyContent = this.grid.clipboardModule.copyContent;
        //   this.grid.rows(copyContent, rowIndex, cellIndex);
        if (this.row) {
          this.grid.flatData.splice(this.rowIndex + 1, 0, this.grid.flatData[this.row])
          this.grid.refreshColumns()
        }

        break;
      }
      case 'pasteChild': {
        if (this.row) {
          var copyContent = this.grid.clipboardModule.copyContent;
          console.log(this.grid.flatData[this.rowIndex].Crew);
          this.grid.flatData[args.rowInfo.rowData.parentItem.index].Crew?.push(this.grid.flatData[this.row])
          this.grid.refresh()
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
    public sorting (args: any ): void {
      if (args.requestType === 'sorting') {
          for (let columns of this.grid.columns) {
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
  public check(field: string, state: boolean): void {
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

  onClick(event: any) {
    this.columns.map(col => {
      if (col.field === event.target.value && event.target.checked) {
        console.log(event.target.value);
        console.log(this.grid);
        this.grid.sortByColumn(col.field, 'Ascending', true);
      }
      else {
        this.grid.grid.removeSortColumn(col.field);
      }

    })

  }
  public onClick1(e: any): void {
    if (this.PlayerJersey.checked) {
        this.grid.sortByColumn('TaskID', 'Ascending', true);
    } else {
        this.grid.grid.removeSortColumn('TaskID');
    }

}
public onClick2(e: any): void {
  if (this.PlayerName.checked) {
      this.grid.sortByColumn('FIELD1', 'Ascending', true);
  } else {
      this.grid.grid.removeSortColumn('FIELD1');
  }

}
public onClick3(e: any): void {
  if (this.Year.checked) {
      this.grid.sortByColumn('FIELD2', 'Ascending', true);
  } else {
      this.grid.grid.removeSortColumn('FIELD2');
  }

}
public onClick4(e: any): void {
  if (this.Stint.checked) {
      this.grid.sortByColumn('FIELD3', 'Ascending', true);
  } else {
      this.grid.grid.removeSortColumn('FIELD3');
  }

}
public onClick5(e: any): void {
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
              data[this.colField] = 'Vinno'
            })
            break;
          }
          case 'number': {
            this.grid.flatData.map((data: any) => {
              data[this.colField] = 4
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
    this.gridService.createColumn(this.grid,this.ejDialog)
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
    this.gridService.chooseColumn(event,this.columns,this.grid,this.columnsCopy)
   
  }
}
