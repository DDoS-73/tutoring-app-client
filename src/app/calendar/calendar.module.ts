import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { CalendarHeaderComponent } from './components/calendar-header/calendar-header.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CalendarBodyComponent } from './components/calendar-body/calendar-body.component';
import { CalendarBodyHourListComponent } from './components/calendar-body/components/calendar-body-hour-list/calendar-body-hour-list.component';
import { HighlightTodayDirective } from './directives/highlight-today.directive';
import { CreateEventDialogComponent } from './components/create-event-dialog/create-event-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { EventFormComponent } from './components/event-form/event-form.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { HammerModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { EventTileComponent } from './components/calendar-body/components/event-tile/event-tile.component';

@NgModule({
  declarations: [
    CalendarHeaderComponent,
    CalendarBodyComponent,
    CalendarBodyHourListComponent,
    HighlightTodayDirective,
    CreateEventDialogComponent,
    EventFormComponent,
    EventTileComponent,
  ],
  exports: [CalendarHeaderComponent, CalendarBodyComponent],
  imports: [
    CommonModule,
    MatGridListModule,
    FlexLayoutModule,
    MatDialogModule,
    MatIconModule,
    MatDividerModule,
    SharedModule,
    ReactiveFormsModule,
    MatInputModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMaterialTimepickerModule,
    HammerModule,
    HttpClientModule,
  ],
})
export class CalendarModule {}
