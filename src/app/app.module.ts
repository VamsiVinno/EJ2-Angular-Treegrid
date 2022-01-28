import { NgModule, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
import { ContextMenuModule } from '@syncfusion/ej2-angular-navigations';
import { DialogModule } from '@syncfusion/ej2-angular-popups';
import { TreeGridModule } from '@syncfusion/ej2-angular-treegrid';
import { AppComponent } from './app.component';
import { ButtonAllModule, CheckBoxAllModule } from '@syncfusion/ej2-angular-buttons';
import { SparklineAllModule } from '@syncfusion/ej2-angular-charts';
import {
  DatePickerModule,
} from '@syncfusion/ej2-angular-calendars';
import {
  DropDownListAllModule,
  MultiSelectAllModule,
} from '@syncfusion/ej2-angular-dropdowns';
import {
  ToolbarModule,
} from '@syncfusion/ej2-angular-navigations';
import { NumericTextBoxAllModule } from '@syncfusion/ej2-angular-inputs';
import { TreeGridAllModule } from '@syncfusion/ej2-angular-treegrid';



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
    ButtonAllModule,
    CheckBoxAllModule,
    TreeGridAllModule,
    NumericTextBoxAllModule,
    ToolbarModule,
    DropDownListAllModule,
    ButtonAllModule,
    DialogModule,
    MultiSelectAllModule,
    CheckBoxAllModule,
    ReactiveFormsModule,
    FormsModule,
    DatePickerModule,
    SparklineAllModule,

  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
