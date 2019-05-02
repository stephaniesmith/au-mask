import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {AppComponent} from './app.component';
import {AuMaskModule} from "./au-mask/au-mask.module";
import { AuMaskDirective } from './au-mask/au-mask.directive';

@NgModule({
    declarations: [
        AppComponent,
        AuMaskDirective
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        AuMaskModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
