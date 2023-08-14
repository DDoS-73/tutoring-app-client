import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { CalendarHeaderComponent } from './components/calendar-header/calendar-header.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CalendarBodyComponent } from './components/calendar-body/calendar-body.component';
import { CalendarBodyHourListComponent } from './components/calendar-body/components/calendar-body-hour-list/calendar-body-hour-list.component';


@NgModule({
  declarations: [
    CalendarHeaderComponent,
    CalendarBodyComponent,
    CalendarBodyHourListComponent
  ],
  exports: [
    CalendarHeaderComponent,
    CalendarBodyComponent
  ],
  imports: [
    CommonModule,
    MatGridListModule,
    FlexLayoutModule
  ]
})
export class CalendarModule {
}
