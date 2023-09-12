import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Event } from '../../models/Event.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private url = environment.baseUrl;
  constructor(private http: HttpClient) {}

  public createEvent(event: Event) {
    return this.http.post(`${this.url}/events`, event);
  }
}
