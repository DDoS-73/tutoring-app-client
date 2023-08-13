import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { CalendarHeaderComponent } from './components/calendar-header/calendar-header.component';
import { FlexLayoutModule } from '@angular/flex-layout';


@NgModule({
  declarations: [
    CalendarHeaderComponent
  ],
  exports: [
    CalendarHeaderComponent
  ],
  imports: [
    CommonModule,
    MatGridListModule,
    FlexLayoutModule
  ]
})
export class CalendarModule {
}
