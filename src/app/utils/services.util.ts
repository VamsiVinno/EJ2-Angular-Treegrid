import { TreeGrid } from "@syncfusion/ej2-treegrid";

export function createColumn(grid: TreeGrid, dialog: any, columnsCopy: any) {
    let input: any = document.getElementById('colName');
    let newColName = input.value;
    var obj = { field: "priority", headerText: newColName, width: 120, checked: true };
    grid.columns.push(obj as any);
    columnsCopy.push(obj as any)
    grid.refreshColumns();
    dialog.hide()
    input.value = ''
}
export function chooseColumn(event: any, { grid, columnsCopy }: { grid: TreeGrid, columnsCopy: any }) {
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
export function editColumn({ grid, form, customAttributes, colField, columnDialog }: { grid: TreeGrid, form: any, customAttributes: any, colField: any, columnDialog: any }) {
    let colObj = form.value
    grid.columns.map((e: any) => {
        if (e.field == colField) {
            if (colObj.name) {
                e.headerText = colObj.name;
            }
            if (colObj.alignment) {
                e.textAlign = colObj.alignment
            }
            customAttributes.style.background = colObj.bgColor;
            customAttributes.style.color = colObj.fontColor;
            customAttributes.style['font-size'] = colObj.size + 'px'
            e.customAttributes = customAttributes
            switch (colObj.type) {
                case 'string': {
                    grid.flatData.map((data: any) => {
                        data[colField] = String(data[colField]) || "none"
                    })
                    break;
                }
                case 'number': {
                    grid.flatData.map((data: any) => {
                        data[colField] = parseInt(data[colField]) || 0;
                    })
                    break;
                }
                case 'date': {
                    grid.flatData.map((data: any) => {
                        data[colField] = new Date(9, 11, 24)
                    })
                    break;
                }
                case 'boolean': {
                    grid.flatData.map((data: any) => {
                        data[colField] = true
                    })
                    break;
                }
            }

            grid.refreshColumns();
            columnDialog.hide()

        }
    })
}
export function cancelDialog(dialog: any) {
    dialog.hide()
}