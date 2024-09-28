import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarBodyComponent } from './components/calendar-body/calendar-body.component';
import { HighlightTodayDirective } from './directives/highlight-today.directive';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { SharedModule } from '../../shared/shared.module';
import { CalendarComponent } from './calendar.component';
import { CalendarRoutingModule } from './calendar-routing.module';
import { HourPipe } from './pipes/hour.pipe';
import { EventFormComponent } from './components/event-form/event-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatInputModule } from '@angular/material/input';
import { FormFieldsModule } from '../../shared/components/form-fields/form-fields.module';
import { MatButtonModule } from '@angular/material/button';
import { EventTileComponent } from './components/event-tile/event-tile.component';
import { MatNativeDateModule } from '@angular/material/core';
import { CalendarHeaderComponent } from './components/calendar-header/calendar-header.component';
import { WeekSelectorComponent } from './components/week-selector/week-selector.component';

@NgModule({
    declarations: [
        CalendarBodyComponent,
        CalendarComponent,
        EventFormComponent,
        HourPipe,
        HighlightTodayDirective,
        EventTileComponent,
        CalendarHeaderComponent,
        WeekSelectorComponent,
    ],
    imports: [
        CommonModule,
        MatDialogModule,
        SharedModule,
        CalendarRoutingModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatDatepickerModule,
        NgxMaterialTimepickerModule,
        MatInputModule,
        FormFieldsModule,
        MatDividerModule,
        MatButtonModule,
        MatNativeDateModule,
    ],
})
export class CalendarModule {}
