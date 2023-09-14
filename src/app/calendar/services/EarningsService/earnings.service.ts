import { Injectable } from '@angular/core';
import { DateService } from '../DateService/date.service';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

interface EarningsResponse {
  actualEarnings: number;
  predictedEarnings: number;
}

@Injectable({
  providedIn: 'root',
})
export class EarningsService {
  private url = environment.baseUrl;

  private _actualMonthEarnings$ = new BehaviorSubject(0);
  private _predictedMonthEarnings$ = new BehaviorSubject(0);
  private _actualWeekEarnings$ = new BehaviorSubject(0);
  private _predictedWeekEarnings$ = new BehaviorSubject(0);
  get actualMonthEarnings$(): Observable<number> {
    return this._actualMonthEarnings$.asObservable();
  }

  get predictedMonthEarnings$(): Observable<number> {
    return this._predictedMonthEarnings$.asObservable();
  }

  get actualWeekEarnings$(): Observable<number> {
    return this._actualWeekEarnings$.asObservable();
  }

  get predictedWeekEarnings$(): Observable<number> {
    return this._predictedWeekEarnings$.asObservable();
  }
  constructor(
    private dateService: DateService,
    private http: HttpClient
  ) {
    this.updateEarnings();
  }

  private getMonthEarning() {
    this.dateService.weekDays$
      .pipe(
        switchMap(days => {
          const params = { dayOfMonth: days[3].toString() };
          return this.http.get<EarningsResponse>(`${this.url}/earnings/month`, {
            params,
          });
        })
      )
      .subscribe(({ predictedEarnings, actualEarnings }) => {
        this._predictedMonthEarnings$.next(predictedEarnings);
        this._actualMonthEarnings$.next(actualEarnings);
      });
  }

  private getWeekEarning() {
    this.dateService.weekDays$
      .pipe(
        switchMap(days => {
          const params = { dayOfWeek: days[3].toString() };
          return this.http.get<EarningsResponse>(`${this.url}/earnings/week`, {
            params,
          });
        })
      )
      .subscribe(({ predictedEarnings, actualEarnings }) => {
        this._predictedWeekEarnings$.next(predictedEarnings);
        this._actualWeekEarnings$.next(actualEarnings);
      });
  }

  public updateEarnings() {
    this.getMonthEarning();
    this.getWeekEarning();
  }
}
