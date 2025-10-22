import { Injectable, signal } from '@angular/core';

@Injectable()
export class DateService {
  public weekDays = signal<Date[]>([]);

  constructor() {
    this.updateWeekDays(new Date());
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
    this.weekDays.set(current7DaysStartingFromMonday);
  }

  public getWeekDayByIndex(index: number) {
    return this.weekDays()[index];
  }
}
