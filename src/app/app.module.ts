import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ChordPracticeComponent } from './chord-practice/chord-practice.component';
import {SliderModule} from 'primeng/slider';
import {FormsModule} from "@angular/forms";
import {PanelModule} from 'primeng/panel';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { NgxEchartsModule } from 'ngx-echarts';
import {ButtonModule} from 'primeng/button';
import {DialogModule} from 'primeng/dialog';
import {CheckboxModule} from 'primeng/checkbox';
import { ChordDiagramComponent } from './chord-diagram/chord-diagram.component';
import {AppRoutingModule} from "./app-routing.module";

@NgModule({
  declarations: [
    AppComponent,
    ChordPracticeComponent,
    ChordDiagramComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SliderModule,
    FormsModule,
    PanelModule,
    BrowserAnimationsModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    ButtonModule,
    DialogModule,
    CheckboxModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
