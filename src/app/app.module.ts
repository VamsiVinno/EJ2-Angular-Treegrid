import { NgModule, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ButtonAllModule, ButtonModule, CheckBoxAllModule, CheckBoxModule } from '@syncfusion/ej2-angular-buttons';
import { DropDownListAllModule, MultiSelectAllModule, MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
import { ContextMenuModule, ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import { DialogModule } from '@syncfusion/ej2-angular-popups';
import { TreeGridAllModule, TreeGridModule } from '@syncfusion/ej2-angular-treegrid';
import { AppComponent } from './app.component';
import { SparklineAllModule } from '@syncfusion/ej2-angular-charts';
import {
    DatePickerModule,
} from '@syncfusion/ej2-angular-calendars';
import { NumericTextBoxAllModule } from '@syncfusion/ej2-angular-inputs';
/**
 * Module
 */
@NgModule({
    imports: [
        BrowserModule,
        TreeGridModule,
        DialogModule,
        MultiSelectModule,
        ReactiveFormsModule,
        ContextMenuModule,
        ButtonModule,
        CheckBoxModule,
        ButtonAllModule,
        CheckBoxAllModule,
        ToolbarModule,
        DropDownListAllModule,
        MultiSelectAllModule,
        FormsModule,
        TreeGridAllModule,
        NumericTextBoxAllModule,
        DatePickerModule,
        SparklineAllModule,

    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]

})
export class AppModule { }


