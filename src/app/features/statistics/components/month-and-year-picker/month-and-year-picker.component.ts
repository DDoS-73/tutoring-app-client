import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
    MAT_MOMENT_DATE_ADAPTER_OPTIONS,
    MomentDateAdapter,
} from '@angular/material-moment-adapter';
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
} from '@angular/material/core';
import { FormControl } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';

import * as _moment from 'moment';
import { Moment } from 'moment';

const moment = _moment;

const MY_FORMATS = {
    parse: {
        dateInput: 'MM/YYYY',
    },
    display: {
        dateInput: 'MM/YYYY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};

@Component({
    selector: 'app-month-and-year-picker',
    templateUrl: './month-and-year-picker.component.html',
    styleUrl: './month-and-year-picker.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
        },
        { provide: MAT_DATE_LOCALE, useValue: 'uk' },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
})
export class MonthAndYearPickerComponent {
    @Input() dateControl!: FormControl;

    protected setMonthAndYear(
        normalizedMonthAndYear: Moment,
        datepicker: MatDatepicker<Moment>
    ) {
        const ctrlValue = this.dateControl.value ?? moment();
        ctrlValue.month(normalizedMonthAndYear.month());
        ctrlValue.year(normalizedMonthAndYear.year());
        this.dateControl.setValue(ctrlValue);
        datepicker.close();
    }
}
