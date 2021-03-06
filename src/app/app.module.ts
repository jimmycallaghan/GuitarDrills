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
import {NgxHowlerService} from "ngx-howler";
import {SelectButtonModule} from 'primeng/selectbutton';
import {FieldsetModule} from 'primeng/fieldset';

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
    CheckboxModule,
    SelectButtonModule,
    FieldsetModule
  ],
  providers: [NgxHowlerService],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    ngxHowlerService: NgxHowlerService
  ) {
    ngxHowlerService.loadScript('https://cdnjs.cloudflare.com/ajax/libs/howler/2.2.0/howler.min.js');
  }
}
