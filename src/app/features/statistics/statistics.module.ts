import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticsComponent } from './statistics.component';
import { StatisticsRoutingModule } from './statistics-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { StatisticsService } from './services/statistics.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MonthAndYearPickerComponent } from './components/month-and-year-picker/month-and-year-picker.component';
import { StatisticsTableComponent } from './components/statistics-table/statistics-table.component';
import { MatTableModule } from '@angular/material/table';

@NgModule({
    declarations: [
        StatisticsComponent,
        MonthAndYearPickerComponent,
        StatisticsTableComponent,
    ],
    imports: [
        CommonModule,
        StatisticsRoutingModule,
        SharedModule,
        MatProgressSpinnerModule,
        MatFormFieldModule,
        MatOptionModule,
        MatSelectModule,
        ReactiveFormsModule,
        MatDatepickerModule,
        MatInputModule,
        MatNativeDateModule,
        MatTableModule,
    ],
    providers: [StatisticsService],
})
export class StatisticsModule {}
