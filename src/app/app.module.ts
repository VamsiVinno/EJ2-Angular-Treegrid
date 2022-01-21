import { NgModule,ViewChild } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
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
        DialogModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }