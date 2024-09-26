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
    private _weekRange$ = new BehaviorSubject<string>('');
    public weekRange$ = this._weekRange$.asObservable();
    private _currentMonth$ = new BehaviorSubject<string>('');
    public currentMonth$ = this._currentMonth$.asObservable();

    constructor(
        @Inject(CALENDAR_CONFIG_TOKEN) protected calendarConfig: CalendarConfig
    ) {
        this.updateWeekDays(new Date());
    }

    ngOnDestroy() {
        this._weekDays$.complete();
        this._weekRange$.complete();
        this._currentMonth$.complete();
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

        this.updateWeekRange();
        this.updateCurrentMonth();
    }

    private updateWeekRange() {
        const startOfWeek = this._weekDays$.getValue()[0];
        const endOfWeek = this._weekDays$.getValue()[6];
        const startMonth =
            this.calendarConfig.monthNamesInGenitiveCase[
                startOfWeek.getMonth()
            ];
        const endMonth =
            this.calendarConfig.monthNamesInGenitiveCase[endOfWeek.getMonth()];
        const startDay = startOfWeek.getDate();
        const endDay = endOfWeek.getDate();

        const weekRange =
            startOfWeek.getMonth() === endOfWeek.getMonth()
                ? `${startDay} - ${endDay} ${startMonth}`
                : `${startDay} ${startMonth} - ${endDay} ${endMonth}`;
        this._weekRange$.next(weekRange);
    }

    private updateCurrentMonth() {
        if (
            this._currentMonth$.getValue() !==
            this.calendarConfig.monthNames[
                this._weekDays$.getValue()[3].getMonth()
            ]
        ) {
            this._currentMonth$.next(
                this.calendarConfig.monthNames[
                    this._weekDays$.getValue()[3].getMonth()
                ]
            );
        }
    }

    public getNextWeek() {
        const thisMonday = this._weekDays$.getValue()[0];
        const nextMonday = new Date(thisMonday);
        nextMonday.setDate(thisMonday.getDate() + 7);
        this.updateWeekDays(nextMonday);
    }

    public getPrevWeek() {
        const thisMonday = this._weekDays$.getValue()[0];
        const prevMonday = new Date(thisMonday);
        prevMonday.setDate(thisMonday.getDate() - 7);
        this.updateWeekDays(prevMonday);
    }

    public getWeekDayByIndex(index: number) {
        return this._weekDays$.getValue()[index];
    }
}
