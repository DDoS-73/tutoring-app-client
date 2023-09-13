import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Event } from '../../models/Event.model';
import { environment } from '../../../../environments/environment';
import { Client } from '../../models/Client.model';
import { DateService } from '../DateService/date.service';
import { BehaviorSubject, switchMap, tap } from 'rxjs';

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
    private dateService: DateService
  ) {
    this.getAllEventsByWeek();
  }

  public createEvent(event: Event) {
    return this.http
      .post<Event>(`${this.url}/events`, event)
      .pipe(
        tap(event => this._events$.next([...this._events$.getValue(), event]))
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

  public getAllClients() {
    return this.http.get<Client[]>(`${this.url}/clients`);
  }
}
