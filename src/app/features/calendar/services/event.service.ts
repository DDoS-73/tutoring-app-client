import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CalendarEvent } from '../models/calendar-event.model';
import { environment } from '../../../../environments/environment';
import { DateService } from './date.service';
import { BehaviorSubject, of, switchMap, tap, withLatestFrom } from 'rxjs';
import { WorkObject } from '../models/work-object.model';
import { CalendarFilters } from '../models/calendar-filters.model';

@Injectable()
export class EventService implements OnDestroy {
    private _events$ = new BehaviorSubject<CalendarEvent[]>([]);
    public events$ = this._events$.asObservable();
    private _workObjects$ = new BehaviorSubject<WorkObject[]>([]);
    public workObjects$ = this._workObjects$.asObservable();

    private filters: CalendarFilters = {
        isPaid: undefined,
        workObjectId: undefined,
    };

    constructor(
        private http: HttpClient,
        private dateService: DateService
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
                tap(() => {
                    this._getAllClients();
                    this._getEvents();
                })
            );
    }

    public updateEvent(event: CalendarEvent, id: number) {
        return this.http
            .put<CalendarEvent>(`${environment.backendApi}/events/${id}`, event)
            .pipe(
                tap(() => {
                    this._getAllClients();
                    this._getEvents();
                })
            );
    }

    public deleteEvent(id: string | number | undefined, all: boolean) {
        const options = { body: { all } };
        return this.http
            .delete(`${environment.backendApi}/events/${id}`, options)
            .pipe(
                tap(() => {
                    this._getEvents();
                })
            );
    }

    public setFilters(filters: CalendarFilters) {
        this.filters = filters;
        this._getEvents();
    }

    private _initEventsAndClients() {
        this.dateService.weekDays$.subscribe(() => this._getEvents());
        this._getAllClients();
    }

    private _getEvents() {
        this._events$.next([]);
        of(null)
            .pipe(
                withLatestFrom(this.dateService.weekDays$),
                switchMap(([, days]) => {
                    const params = new HttpParams()
                        .set('from', days[0].toString())
                        .set('to', days[6].toString())
                        .set('isPaid', this.filters.isPaid ?? '')
                        .set('workObjectId', this.filters.workObjectId ?? '');
                    return this.http.get<CalendarEvent[]>(
                        `${environment.backendApi}/events`,
                        {
                            params,
                        }
                    );
                })
            )
            .subscribe(events => {
                this._events$.next(
                    events.map(event => new CalendarEvent(event))
                );
            });
    }

    private _getAllClients() {
        this.http
            .get<WorkObject[]>(`${environment.backendApi}/clients`)
            .subscribe(clients => this._workObjects$.next(clients));
    }
}
