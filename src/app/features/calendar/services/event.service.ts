import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CalendarEvent } from '../models/calendarEvent.model';
import { environment } from '../../../../environments/environment';
import { DateService } from './date.service';
import { BehaviorSubject, map, switchMap, tap } from 'rxjs';
import { EarningsService } from './earnings.service';
import { WorkObject } from '../models/work-object.model';

@Injectable()
export class EventService implements OnDestroy {
    private _events$ = new BehaviorSubject<CalendarEvent[]>([]);
    public events$ = this._events$.asObservable();
    private _workObjects$ = new BehaviorSubject<WorkObject[]>([]);
    public workObjects$ = this._workObjects$.asObservable();

    constructor(
        private http: HttpClient,
        private dateService: DateService,
        private earningService: EarningsService
    ) {
        this._initEventsAndClients();
    }

    ngOnDestroy() {
        this._events$.complete();
        this._workObjects$.complete();
    }

    public createEvent(event: CalendarEvent) {
        return this.http
            .post<CalendarEvent>(`${environment.backendApi}/events`, event)
            .pipe(
                tap(event => {
                    this._events$.next([
                        ...this._events$.getValue(),
                        new CalendarEvent(event),
                    ]);
                    this.earningService.updateEarnings();
                    this._getAllClients();
                })
            );
    }

    public updateEvent(event: CalendarEvent, id: number) {
        return this.http
            .put<CalendarEvent>(`${environment.backendApi}/events/${id}`, event)
            .pipe(
                tap(event => {
                    this._events$.next(
                        this._events$
                            .getValue()
                            .map(el =>
                                el.id === event.id
                                    ? new CalendarEvent(event)
                                    : el
                            )
                    );
                    this.earningService.updateEarnings();
                    this._getAllClients();
                })
            );
    }

    public deleteEvent(id: string | number | undefined) {
        return this.http.delete(`${environment.backendApi}/events/${id}`).pipe(
            tap(() => {
                this._events$.next(
                    this._events$.getValue().filter(el => el.id !== id)
                );
                this.earningService.updateEarnings();
            })
        );
    }

    private _initEventsAndClients() {
        this.dateService.weekDays$
            .pipe(
                switchMap(days => this._getEvents(days[0], days[6])),
                map(events => events.map(event => new CalendarEvent(event)))
            )
            .subscribe(events => this._events$.next(events));

        this._getAllClients();
    }

    private _getEvents(from: Date, to: Date) {
        const params = new HttpParams()
            .set('from', from.toString())
            .set('to', to.toString());
        return this.http.get<CalendarEvent[]>(
            `${environment.backendApi}/events`,
            {
                params,
            }
        );
    }

    private _getAllClients() {
        this.http
            .get<WorkObject[]>(`${environment.backendApi}/clients`)
            .subscribe(clients => this._workObjects$.next(clients));
    }
}
