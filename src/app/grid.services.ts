import { Injectable } from "@angular/core";
import { TreeGrid, TreeGridComponent } from "@syncfusion/ej2-angular-treegrid";

@Injectable({
    providedIn: 'root'
})
export class GridService {
    cancelDialog(dialog: any) {
        dialog.hide()
    }
    createColumn(grid:TreeGrid,dialog:any,columnsCopy:any) {
        let input: any = document.getElementById('colName');
    let newColName = input.value;
        var obj = { field: "priority", headerText: newColName, width: 120,checked:true };
        grid.columns.push(obj as any);
        columnsCopy.push(obj as any)
       grid.refreshColumns();
        dialog.hide()
        input.value=''
      }
    chooseColumn(event: any, { grid, columnsCopy}: { grid: TreeGrid, columnsCopy: any}) {
        let checkedColumns = []
        checkedColumns.push(event.target.value)
        if (event.target.checked == false) {
            checkedColumns.forEach(e => {
                grid.columns.forEach((f: any) => {
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
