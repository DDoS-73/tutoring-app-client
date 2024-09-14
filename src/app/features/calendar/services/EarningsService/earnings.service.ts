import { Injectable } from '@angular/core';
import { DateService } from '../DateService/date.service';
import { BehaviorSubject, forkJoin, Observable, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

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
        this.initEarningsUpdate();
    }

    public getMonthEarnings(dayOfMonth: string) {
        const params = { dayOfMonth };
        return this.http.get<EarningsResponse>(`${this.url}/earnings/month`, {
            params,
        });
    }

    private updateMonthEarningsDependOnDate() {
        this.dateService.weekDays$
            .pipe(switchMap(days => this.getMonthEarnings(days[3].toString())))
            .subscribe(({ predictedEarnings, actualEarnings }) => {
                this._predictedMonthEarnings$.next(predictedEarnings);
                this._actualMonthEarnings$.next(actualEarnings);
            });
    }

    public getWeekEarnings(dayOfWeek: string) {
        const params = { dayOfWeek };
        return this.http.get<EarningsResponse>(`${this.url}/earnings/week`, {
            params,
        });
    }

    private updateWeekEarningsDependOnDate() {
        this.dateService.weekDays$
            .pipe(switchMap(days => this.getWeekEarnings(days[3].toString())))
            .subscribe(({ predictedEarnings, actualEarnings }) => {
                this._predictedWeekEarnings$.next(predictedEarnings);
                this._actualWeekEarnings$.next(actualEarnings);
            });
    }

    private initEarningsUpdate() {
        this.updateMonthEarningsDependOnDate();
        this.updateWeekEarningsDependOnDate();
    }

    public updateEarnings() {
        forkJoin([
            this.getWeekEarnings(
                this.dateService.getWeekDayByIndex(3).toString()
            ),
            this.getMonthEarnings(
                this.dateService.getWeekDayByIndex(3).toString()
            ),
        ]).subscribe(([weekEarnings, monthEarnings]) => {
            this._predictedWeekEarnings$.next(weekEarnings.predictedEarnings);
            this._actualWeekEarnings$.next(weekEarnings.actualEarnings);

            this._predictedMonthEarnings$.next(monthEarnings.predictedEarnings);
            this._actualMonthEarnings$.next(monthEarnings.actualEarnings);
        });
    }
}
