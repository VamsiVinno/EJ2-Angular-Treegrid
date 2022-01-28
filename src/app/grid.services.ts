import { Injectable } from "@angular/core";
import { TreeGridComponent } from "@syncfusion/ej2-angular-treegrid";

@Injectable({
    providedIn: 'root'
})
export class GridService {

    cancelDialog(dialog: any) {
        dialog.hide()
    }
    createColumn(grid:TreeGridComponent,dialog:any) {
        let input: any = document.getElementById('colName');
    let newColName = input.value;
        var obj = { field: "priority", headerText: newColName, width: 120 };
        grid.columns.push(obj as any);
       grid.refreshColumns();
        dialog.hide()
      }
    chooseColumn(event: any, {columns, grid, columnsCopy}: {columns: any, grid: TreeGridComponent, columnsCopy: any}) {
        let checkedColumns = []
        checkedColumns.push(event.target.value)
        if (event.target.checked == false) {
            checkedColumns.forEach(e => {
                columns.forEach((f: any) => {
                    if (e === f.field) {
                        grid.hideColumns([f.field, f.headerText]);
                    }
                })
            })
        }
        else if (event.target.checked) {
            checkedColumns.forEach(e => {
                columnsCopy.forEach((f: any) => {
                    if (e === f.field) {
                        grid.showColumns([f.field, f.headerText]);
                    }
                })
            })
        }
    }
}
