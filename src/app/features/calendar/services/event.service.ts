import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { injectMutation, injectQuery, QueryClient, QueryFunctionContext } from '@tanstack/angular-query-experimental';
import { lastValueFrom, map } from 'rxjs';
import { ApiEndpoints } from 'src/app/core/api/endpoints';
import { ParticipantService } from 'src/app/core/services/participant.service';
import { environment } from '../../../../environments/environment';
import { CalendarEvent } from '../models/calendar-event.model';
import { DeleteEventRequest } from '../models/requests/delete-event.request';
import { UpdateEventRequest } from '../models/requests/update-event.request';
import { DateService } from './date.service';

@Injectable()
export class EventService {
  private readonly queryClient = inject(QueryClient);
  private readonly http = inject(HttpClient);
  private readonly dateService = inject(DateService);
  private readonly participantService = inject(ParticipantService);

  public readonly participantsQuery = this.participantService.participantsQuery;

  public eventsQuery = injectQuery(() => {
    const weekDays = this.dateService.currentWeekDays();
    const from = weekDays[0].toISOString();
    const to = weekDays[weekDays.length - 1].toISOString();
    return {
      queryKey: ['events', from, to],
      queryFn: this._getEvents.bind(this),
      ...this._getQueryOptions(),
    };
  });

  public createEventMutation = injectMutation(() => ({
    mutationFn: this._createEvent.bind(this),
    onSuccess: () => {
      this.queryClient.invalidateQueries({ queryKey: ['events'] });
      this.queryClient.invalidateQueries({ queryKey: ['participants'] });
    },
  }));

  public deleteEventMutation = injectMutation(() => ({
    mutationFn: this._deleteEvent.bind(this),
    onSuccess: () => this.queryClient.invalidateQueries({ queryKey: ['events'] }),
  }));

  public updateEventMutation = injectMutation(() => ({
    mutationFn: this._updateEvent.bind(this),
    onSuccess: () => {
      this.queryClient.invalidateQueries({ queryKey: ['events'] });
      this.queryClient.invalidateQueries({ queryKey: ['participants'] });
    },
  }));

  private _getEvents(context: QueryFunctionContext) {
    const [, from, to] = context.queryKey;
    const params = new HttpParams().set('from', String(from)).set('to', String(to));

    return lastValueFrom(
      this.http
        .get<CalendarEvent[]>(`${environment.backendApi}${ApiEndpoints.Events.getAll}`, { params })
        .pipe(map((events) => events.map((event) => new CalendarEvent(event))))
    );
  }

  private _createEvent(event: CalendarEvent) {
    return lastValueFrom(
      this.http.post<CalendarEvent>(`${environment.backendApi}${ApiEndpoints.Events.create}`, event)
    );
  }

  private _deleteEvent({ id, mode, date }: DeleteEventRequest) {
    const params = new HttpParams().set('mode', mode).set('date', date.toISOString());
    return lastValueFrom(
      this.http.delete<void>(`${environment.backendApi}${ApiEndpoints.Events.delete(id)}`, { params })
    );
  }

  private _updateEvent({ calendarEvent, mode, date }: UpdateEventRequest) {
    const params = new HttpParams().set('mode', mode).set('date', date.toISOString());
    return lastValueFrom(
      this.http.patch<CalendarEvent>(
        `${environment.backendApi}${ApiEndpoints.Events.update(calendarEvent.id)}`,
        calendarEvent,
        { params }
      )
    );
  }

  private _getQueryOptions() {
    return {
      staleTime: Infinity,
      gcTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: true,
    };
  }
}
