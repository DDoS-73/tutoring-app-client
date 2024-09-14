import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { CalendarHeaderComponent } from './components/calendar-header/calendar-header.component';
import { CalendarBodyComponent } from './components/calendar-body/calendar-body.component';
import { CalendarBodyHourListComponent } from './components/calendar-body/components/calendar-body-hour-list/calendar-body-hour-list.component';
import { HighlightTodayDirective } from './directives/highlight-today.directive';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { SharedModule } from '../../shared/shared.module';
import { HammerModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { EventModule } from '../../event/event.module';
import { CalendarComponent } from './calendar.component';
import { CalendarRoutingModule } from './calendar-routing.module';

@NgModule({
    declarations: [
        CalendarHeaderComponent,
        CalendarBodyComponent,
        CalendarBodyHourListComponent,
        HighlightTodayDirective,
        CalendarComponent,
    ],
    exports: [CalendarHeaderComponent, CalendarBodyComponent],
    imports: [
        CommonModule,
        MatGridListModule,
        MatDialogModule,
        MatDividerModule,
        SharedModule,
        HammerModule,
        HttpClientModule,
        EventModule,
        CalendarRoutingModule,
    ],
})
export class CalendarModule {}
