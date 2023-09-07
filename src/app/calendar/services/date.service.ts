import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  monthNames,
  monthNamesInGenitiveCase,
} from '../../shared/const/monthNames';

@Injectable({
  providedIn: 'root',
})
export class DateService {
  constructor() {
    this.updateWeekDays(new Date());
    this.updateWeekRange();
    this.updateCurrentMonth();
  }

  private weekDays$ = new BehaviorSubject<Date[]>([]);
  private weekRange$ = new BehaviorSubject<string>('');
  private currentMonth$ = new BehaviorSubject<string>('');
  get weekDays(): Observable<Date[]> {
    return this.weekDays$.asObservable();
  }
  get weekRange(): Observable<string> {
    return this.weekRange$.asObservable();
  }
  get currentMonth(): Observable<string> {
    return this.currentMonth$.asObservable();
  }

  private updateWeekDays(weekDay: Date) {
    const currentDayOfWeek = weekDay.getDay();
    const daysSinceMonday = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;
    const mostRecentMonday = new Date(weekDay);
    mostRecentMonday.setDate(weekDay.getDate() - daysSinceMonday);
    const current7DaysStartingFromMonday = [];
    for (let i = 0; i < 7; i++) {
      current7DaysStartingFromMonday.push(new Date(mostRecentMonday));
      mostRecentMonday.setDate(mostRecentMonday.getDate() + 1);
    }
    this.weekDays$.next(current7DaysStartingFromMonday);
  }

  private updateWeekRange() {
    const startOfWeek = this.weekDays$.getValue()[0];
    const endOfWeek = this.weekDays$.getValue()[6];
    const startMonth = monthNamesInGenitiveCase[startOfWeek.getMonth()];
    const endMonth = monthNamesInGenitiveCase[endOfWeek.getMonth()];
    const startDay = startOfWeek.getDate();
    const endDay = endOfWeek.getDate();

    const weekRange =
      startOfWeek.getMonth() === endOfWeek.getMonth()
        ? `${startDay} - ${endDay} ${startMonth}`
        : `${startDay} ${startMonth} - ${endDay} ${endMonth}`;
    this.weekRange$.next(weekRange);
  }

  private updateCurrentMonth() {
    this.currentMonth$.next(
      monthNames[this.weekDays$.getValue()[3].getMonth()]
    );
  }

  public getNextWeek() {
    //empty
  }

  public getPrevWeek() {
    //empty
  }
}
