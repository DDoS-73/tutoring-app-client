import { Injectable } from '@angular/core';
import {
    DateRange,
    MatDateRangeSelectionStrategy,
} from '@angular/material/datepicker';
import { DateAdapter } from '@angular/material/core';

@Injectable()
export class WeekRangeSelectionStrategy<D extends Date>
    implements MatDateRangeSelectionStrategy<D>
{
    constructor(private _dateAdapter: DateAdapter<D>) {}

    selectionFinished(date: D | null): DateRange<D> {
        return this._createFiveDayRange(date);
    }

    createPreview(activeDate: D | null): DateRange<D> {
        return this._createFiveDayRange(activeDate);
    }

    private _createFiveDayRange(date: D | null): DateRange<D> {
        if (date) {
            const dayOfWeek = date.getDay();
            const startOffset = dayOfWeek ? -dayOfWeek + 1 : -6;
            const endOffset = dayOfWeek ? 7 - dayOfWeek : 0;
            const start = this._dateAdapter.addCalendarDays(date, startOffset);
            const end = this._dateAdapter.addCalendarDays(date, endOffset);
            return new DateRange<D>(start, end);
        }

        return new DateRange<D>(null, null);
    }
}
