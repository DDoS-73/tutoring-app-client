import { Injectable, signal } from '@angular/core';

@Injectable()
export class DateService {
  public previousWeekDays = signal<Date[]>([]);
  public currentWeekDays = signal<Date[]>([]);
  public nextWeekDays = signal<Date[]>([]);

  constructor() {
    this.updateAllWeeksDays(new Date());
  }

  public updateAllWeeksDays(weekDay: Date) {
    const previousWeekDay = new Date(weekDay);
    previousWeekDay.setDate(weekDay.getDate() - 7);
    const nextWeekDay = new Date(weekDay);
    nextWeekDay.setDate(weekDay.getDate() + 7);

    this.previousWeekDays.set(this._calculateWeekDays(previousWeekDay));
    this.currentWeekDays.set(this._calculateWeekDays(weekDay));
    this.nextWeekDays.set(this._calculateWeekDays(nextWeekDay));
  }

  private _calculateWeekDays(weekDay: Date) {
    const currentDayOfWeek = weekDay.getDay();

    const daysSinceMonday = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;
    const mostRecentMonday = new Date(weekDay);
    mostRecentMonday.setDate(weekDay.getDate() - daysSinceMonday);
    mostRecentMonday.setHours(0, 0, 0, 0);

    const current7DaysStartingFromMonday = [];
    for (let i = 0; i < 7; i++) {
      current7DaysStartingFromMonday.push(new Date(mostRecentMonday));
      mostRecentMonday.setDate(mostRecentMonday.getDate() + 1);
    }
    current7DaysStartingFromMonday[6].setHours(23, 59, 59, 999);
    return current7DaysStartingFromMonday;
  }

  public getWeekDayByIndex(index: number) {
    return this.currentWeekDays()[index];
  }
}
