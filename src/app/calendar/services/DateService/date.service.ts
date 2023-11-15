import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  monthNames,
  monthNamesInGenitiveCase,
} from '../../../shared/const/monthNames';

@Injectable({
  providedIn: 'root',
})
export class DateService {
  constructor() {
    this.updateWeekDays(new Date());
  }

  private _weekDays$ = new BehaviorSubject<Date[]>([]);
  private _weekRange$ = new BehaviorSubject<string>('');
  private _currentMonth$ = new BehaviorSubject<string>('');
  get weekDays$(): Observable<Date[]> {
    return this._weekDays$.asObservable();
  }
  get weekRange$(): Observable<string> {
    return this._weekRange$.asObservable();
  }
  get currentMonth$(): Observable<string> {
    return this._currentMonth$.asObservable();
  }

  public updateWeekDays(weekDay: Date) {
    const currentDayOfWeek = weekDay.getDay();
    const daysSinceMonday = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;
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
    const startMonth = monthNamesInGenitiveCase[startOfWeek.getMonth()];
    const endMonth = monthNamesInGenitiveCase[endOfWeek.getMonth()];
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
      monthNames[this._weekDays$.getValue()[3].getMonth()]
    ) {
      this._currentMonth$.next(
        monthNames[this._weekDays$.getValue()[3].getMonth()]
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
