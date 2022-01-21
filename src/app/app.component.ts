import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { VirtualScrollService, TreeGridComponent, ColumnChooserService, ToolbarService, FreezeService, FilterService, SortService, RowDDService, SelectionService, EditSettingsModel, ToolbarItems, EditService, ContextMenuService, PageService } from '@syncfusion/ej2-angular-treegrid';
import { dataSource, virtualData } from './data';
import { Dialog } from '@syncfusion/ej2-popups';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [VirtualScrollService, ColumnChooserService, ToolbarService, FreezeService, FilterService, SortService,
    RowDDService, SelectionService, EditService, ContextMenuService,PageService]
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('grid') grid!: any;

  public data: Object[] | undefined;
  public toolbar: string[] | undefined;
  public infiniteScrollSettings!: Object;
  public selectOptions!: Object;
  public toolbarOptions!: any[];
  public editSettings!: EditSettingsModel;
  v = true;
  public contextMenuItems!: any[];
  public treeGridObj!: TreeGridComponent;
  show!:boolean
  @ViewChild('ejDialog') ejDialog!: DialogComponent;
  public targetElement!: HTMLElement;
  public rowIndex!: number;
  public cellIndex!: number;
  private headerContextMenuItems = [
    { text: 'EditCol', target: '.e-headercell', id: 'editCol' },
    { text: 'NewCol', target: '.e-headercell', id: 'newCol' },
    { text: 'DelCol', target: '.e-headercell', id: 'delCol' },
    { text: 'ChooseCol', target: '.e-headercell', id: 'chooseCol' },
    { text: 'FreezeCol', target: '.e-headercell', id: 'freezeCol' },
    {text:'Fiter',target:'.e-headercell', id: 'filter'}

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
    this.contextMenuItems = [...this.headerContextMenuItems,'SortAscending', 'SortDescending','Edit','Delete','AddRow',...this.rowContextMenuItems];
  
  this.show=false
  }
  contextMenuOpen(args:any): void {
    this.rowIndex = args.rowInfo.rowIndex;
    this.cellIndex = args.rowInfo.cellIndex;
  }
  contextMenuClick(args?: any): void {
      if (args.item.id === 'editCol') {
        console.log(this.grid.columnModel[0].field);
        const column =  this.grid.getColumnByField(this.grid.columnModel[0].field)
        console.log(column);
        column.headerText = "Changed Text";
        this.grid.refreshColumns()
    }
    if (args.item.id === 'newCol') {       
       var obj = { field: "priority", headerText: 'NewColumn', width: 120 };  
             this.grid.columns.push(obj as any);          
             this.grid.refreshColumns();
    }
    // if (args.item.id === 'delCol') {
    //   this.grid.columns.filter((i:any,x:any) => {  
    //       if(i.field == 'NewColumn') { 
    //       this.grid.columns.splice(x,1); 
    //   } 
    //   }); 
    //   this.grid.refreshColumns(); 
    //     } 
    if(args.item.id === 'filter') {
      this.show=true
    }   
    if(args.item.id === 'multiSelect') {
      
      this.selectOptions={type: 'Multiple'}
    }
    if(args.item.id === 'multiSelect') {
      
      this.selectOptions={type: 'Multiple'}
    }
    if(args.item.id === 'copyRow'){
this.grid.copy()

    }
    if(args.item.id === 'pasteNext'){
      // this.selectOptions = { type: 'Multiple', mode: 'Cell', cellSelectionMode: 'Box' };
      var rowIndex = this.rowIndex;
      var cellIndex = this.cellIndex;
      var copyContent = this.grid.clipboardModule.copyContent;
      this.grid.paste(copyContent, rowIndex, cellIndex);
          }

}
  ngAfterViewInit() {
    console.log(this.grid);
  }

  onDrag(event: any) {
    console.log(event);
    this.v = false;
  }
  openDialog() {
    this.ejDialog.show();
}
closeDialog() {
  this.ejDialog.hide()
}
  onClick(event: any) {
    console.log(event);
  }
  
}
