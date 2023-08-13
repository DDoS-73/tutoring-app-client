import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDividerModule } from '@angular/material/divider';
import { BodyComponent } from './components/body/body.component';
import { CalendarModule } from '../calendar/calendar.module';



@NgModule({
  declarations: [
    HeaderComponent,
    BodyComponent,
  ],
  exports: [
    HeaderComponent,
    BodyComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatDividerModule,
    CalendarModule
  ]
})
export class SharedModule { }
