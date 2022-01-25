import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, AfterViewInit, OnChanges } from '@angular/core';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { VirtualScrollService, TreeGridComponent, ColumnChooserService, ToolbarService, FreezeService, FilterService, SortService, RowDDService, SelectionService, EditSettingsModel, ToolbarItems, EditService, ContextMenuService, PageService, LoggerService } from '@syncfusion/ej2-angular-treegrid';
import { dataSource, virtualData } from './data';
import { Dialog } from '@syncfusion/ej2-popups';
import { DialogUtility } from '@syncfusion/ej2-popups';
import { FormBuilder } from '@angular/forms';
import { Alignments, Types } from './type.constant';
import { BeforeOpenCloseMenuEventArgs, MenuEventArgs } from '@syncfusion/ej2-navigations';
import { createCheckBox } from '@syncfusion/ej2-buttons';
import { closest, createElement } from '@syncfusion/ej2-base';
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
    type: [],
    alignment: []
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
  private row!:number
  private headerContextMenuItems = [
    { text: 'EditCol', target: '.e-headercell', id: 'editCol' },
    { text: 'NewCol', target: '.e-headercell', id: 'newCol' },
    { text: 'DelCol', target: '.e-headercell', id: 'delCol' },
    { text: 'ChooseCol', target: '.e-headercell', id: 'chooseCol' },
    { text: 'FreezeCol', target: '.e-headercell', id: 'freezeCol' },
    { text: 'Fiter', target: '.e-headercell', id: 'filter' },
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
  }
  contextMenuClick(args?: any): void {
    if (args.item.id === 'editCol') {
      this.columnDialog.show()
      this.colField = args.column.field
      this.headerText = args.column.headerText
      this.textAlign = args.column.textAlign
    }
    if (args.item.id === 'sorting') {
      this.sort = true
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
  this.row=this.rowIndex
    }
    if (args.item.id === 'pasteNext') {
      // this.selectOptions = { type: 'Multiple', mode: 'Cell', cellSelectionMode: 'Box' };
      //   var rowIndex = args.rowInfo.rowIndex;
      //   var cellIndex = args.rowInfo.cellIndex;
      var copyContent = this.grid.clipboardModule.copyContent;
      //   this.grid.rows(copyContent, rowIndex, cellIndex);
      console.log(copyContent);
      this.grid.flatData.splice(this.rowIndex + 1, 0, this.grid.flatData[this.row])
      this.grid.refreshColumns()
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
    // this.v = false;
  }
  public itemBeforeEvent(args: any) {
    args.items.map((e: any) => {
      if (args.item.text == 'FreezeCol' || args.item.text == 'Fiter' || args.item.text == 'MultiSorting') {
        let shortCutSpan: HTMLElement = createElement('span');
        let text: any = args.item.text;
        args.element.textContent = '';
        let inputEle = createElement('input') as HTMLInputElement;
        inputEle.type = 'checkbox';
        inputEle.setAttribute('class', 'e-checkbox');
        shortCutSpan.innerText = text;
        args.element.appendChild(inputEle);
        args.element.appendChild(shortCutSpan);
      }
    })
  }
  onSelect(args: any) {
    console.log(args);
    if (args.item.id === 'editCol') {
      this.columnDialog.show()
      this.colField = args.column.field
      this.headerText = args.column.headerText
      this.textAlign = args.column.textAlign
    }
    if (
      args.event.target.classList.contains('e-checkbox') && args.item.id == 'filter'

    ) {
      if (args.event.target.checked) {
        this.show = true
      }
      else this.show = false

      // var checkbox = args.element.querySelector('.e-checkbox');
      // checkbox.checked = !checkbox.checked;

    }

    // if (args.item.text === 'Edit') {
    //   if (this.grid.getSelectedRecords().length) {
    //     this.grid.startEdit();
    //   } else {
    //     alert('Select any row');
    //   }
    // }
  }
  //   public itemRender(args: any) {

  //     let check: Element = createCheckBox(createElement, false, {
  //       label: args.item.text,
  //       checked: (args.item.text == 'DelCol') ? true : false
  //     });
  //     args.element.innerHTML = '';
  //     args.element.appendChild(check);
  //   }
  //   public beforeClose(args:any ) {

  //     if ((args.event.target as Element).closest('.e-menu-item')) {
  //         args.cancel = true;
  //         let selectedElem: NodeList = args.element.querySelectorAll('.e-selected');
  //         for(let i:number=0; i < selectedElem.length; i++){
  //             let ele: Element = selectedElem[i] as Element;
  //             ele.classList.remove('e-selected');
  //         }
  //         let checkbox: HTMLElement = closest(args.event.target as Element, '.e-checkbox-wrapper') as HTMLElement;
  //         let frame: any = checkbox.querySelector('.e-frame');
  //         if (checkbox && frame.classList.contains('e-check')) {
  //             frame.classList.remove('e-check');
  //         } else if (checkbox) {
  //             frame.classList.add('e-check');
  //         }
  //     }
  // }
  onEditColumn() {
    console.log(this.colField);
    console.log(this.grid.columns);
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
        if (colObj.type == 'string') {
          this.grid.flatData.map((data: any) => {
            data[this.colField] = 'Vinno'
          })
        }
        if (colObj.type == 'number') {
          this.grid.flatData.map((data: any) => {
            data[this.colField] = 4
          })
        }
        if (colObj.type == 'date') {
          this.grid.flatData.map((data: any) => {
            data[this.colField] = new Date(9, 11, 24)
          })
        }
        if (colObj.type == 'boolean') {
          this.grid.flatData.map((data: any) => {
            data[this.colField] = true
          })
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
  onEditCancel() {
    this.columnDialog.hide()
  }
  onChooseColumn(event: any) {
    let checkedColumns = []
    checkedColumns.push(event.target.value)
    if (event.target.checked == false) {
      checkedColumns.map(e => {
        this.columns.map(f => {
          if (e === f.field) {
            this.grid.hideColumns([f.field, f.headerText]);
            // let index = this.columns.indexOf(f)
            // this.columns.splice(index, 1)
          }
        })
      })
    }
    if (event.target.checked) {
      checkedColumns.map(e => {
        this.columnsCopy.map(f => {
          if (e === f.field) {
            this.grid.showColumns([f.field, f.headerText]);
            // this.columns.push(f)
          }
        })
      })
    }
  }
}
