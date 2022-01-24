import { NgModule,ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
import { DialogModule } from '@syncfusion/ej2-angular-popups';
import { TreeGridModule } from '@syncfusion/ej2-angular-treegrid';
import { AppComponent } from './app.component';

/**
 * Module
 */
@NgModule({
    imports: [
        BrowserModule,
        TreeGridModule,
        DialogModule,
        MultiSelectModule,
        ReactiveFormsModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }