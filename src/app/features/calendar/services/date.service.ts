import { Inject, Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
    CALENDAR_CONFIG_TOKEN,
    CalendarConfig,
} from '../models/calendar.config';

@Injectable()
export class DateService implements OnDestroy {
    private _weekDays$ = new BehaviorSubject<Date[]>([]);
    public weekDays$ = this._weekDays$.asObservable();

    constructor(
        @Inject(CALENDAR_CONFIG_TOKEN) protected calendarConfig: CalendarConfig
    ) {
        this.updateWeekDays(new Date());
    }

    ngOnDestroy() {
        this._weekDays$.complete();
    }

    public updateWeekDays(weekDay: Date) {
        const currentDayOfWeek = weekDay.getDay();

        const daysSinceMonday =
            currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;
        const mostRecentMonday = new Date(weekDay);
        mostRecentMonday.setDate(weekDay.getDate() - daysSinceMonday);

        const current7DaysStartingFromMonday = [];
        for (let i = 0; i < 7; i++) {
            current7DaysStartingFromMonday.push(new Date(mostRecentMonday));
            mostRecentMonday.setDate(mostRecentMonday.getDate() + 1);
        }
        this._weekDays$.next(current7DaysStartingFromMonday);
    }

    public getWeekDayByIndex(index: number) {
        return this._weekDays$.getValue()[index];
    }
}
