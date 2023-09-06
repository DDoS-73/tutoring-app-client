import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DateService {
  private weekDays$ = new BehaviorSubject<Date[]>([]);

  get weekDays(): Observable<Date[]> {
    return this.weekDays$.asObservable();
  }

  constructor() {
    this.getWeekDays(new Date());
  }

  private getWeekDays(weekDay: Date) {
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

  public getNextWeek() {
    //empty
  }

  public getPrevWeek() {
    //empty
  }
}
