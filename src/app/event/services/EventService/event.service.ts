import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Event } from '../../models/Event.model';
import { environment } from '../../../../environments/environment';
import { Client } from '../../../calendar/models/Client.model';
import { DateService } from '../../../calendar/services/DateService/date.service';
import { BehaviorSubject, switchMap, tap } from 'rxjs';
import { EarningsService } from '../../../calendar/services/EarningsService/earnings.service';
import { SuccessResponse } from '../../../shared/models/SuccessResponse.model';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private url = environment.baseUrl;
  private _events$ = new BehaviorSubject<Event[]>([]);

  get events$() {
    return this._events$.asObservable();
  }
  constructor(
    private http: HttpClient,
    private dateService: DateService,
    private earningService: EarningsService
  ) {
    this.getAllEventsByWeek();
  }

  public createEvent(event: Event) {
    return this.http.post<Event>(`${this.url}/events`, event).pipe(
      tap(event => {
        this._events$.next([...this._events$.getValue(), event]);
        this.earningService.updateEarnings();
      })
    );
  }

  public getAllEventsByWeek() {
    this.dateService.weekDays$
      .pipe(
        switchMap(days => {
          const params = { weekDay: days[0].toString() };
          return this.http.get<Event[]>(`${this.url}/events`, { params });
        })
      )
      .subscribe(events => this._events$.next(events));
  }

  public changePaidStatus(_id: string | number) {
    return this.http
      .patch<Event>(`${this.url}/events/changePaidStatus`, { _id })
      .pipe(
        tap(updatedEvent => {
          this._events$.next(
            this._events$
              .getValue()
              .map(event => (event._id === _id ? updatedEvent : event))
          );
        })
      );
  }

  public deleteEvent(id: string | number | undefined) {
    return this.http.delete<SuccessResponse>(`${this.url}/events/${id}`).pipe(
      tap(() => {
        this._events$.next(
          this._events$.getValue().filter(el => el._id !== id)
        );
      })
    );
  }

  public getAllClients() {
    return this.http.get<Client[]>(`${this.url}/clients`);
  }
}
