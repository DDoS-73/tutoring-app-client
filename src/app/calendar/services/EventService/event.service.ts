import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Event } from '../../models/Event.model';
import { environment } from '../../../../environments/environment';
import { Client } from '../../models/Client.model';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private url = environment.baseUrl;
  constructor(private http: HttpClient) {}

  public createEvent(event: Event) {
    return this.http.post(`${this.url}/events`, event);
  }

  public getAllClients() {
    return this.http.get<Client[]>(`${this.url}/clients`);
  }
}
