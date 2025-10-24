import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  injectMutation,
  injectQuery,
  QueryClient,
  QueryFunctionContext,
} from '@tanstack/angular-query-experimental';
import { lastValueFrom, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CalendarEvent } from '../models/calendar-event.model';
import { Participant } from '../models/participant.model';
import { DateService } from './date.service';

@Injectable()
export class EventService {
  private readonly queryClient = inject(QueryClient);
  private readonly http = inject(HttpClient);
  private readonly dateService = inject(DateService);

  public eventsQuery = injectQuery(() => {
    const weekDays = this.dateService.weekDays();
    const from = weekDays[0].toISOString();
    const to = weekDays[weekDays.length - 1].toISOString();
    return {
      queryKey: ['events', from, to],
      queryFn: this._getEvents.bind(this),
      ...this._getQueryOptions(),
    };
  });

  public participantsQuery = injectQuery(() => ({
    queryKey: ['participants'],
    queryFn: this._getParticipants.bind(this),
    ...this._getQueryOptions(),
    refetchOnMount: true,
  }));

  public createEventMutation = injectMutation(() => ({
    mutationFn: this._createEvent.bind(this),
    onSuccess: () => {
      this.queryClient.invalidateQueries({ queryKey: ['events'] });
      this.queryClient.invalidateQueries({ queryKey: ['participants'] });
    },
  }));

  public deleteEventMutation = injectMutation(() => ({
    mutationFn: this._deleteEvent.bind(this),
    onSuccess: () =>
      this.queryClient.invalidateQueries({ queryKey: ['events'] }),
  }));

  public updateEventMutation = injectMutation(() => ({
    mutationFn: this._updateEvent.bind(this),
    onSuccess: () => {
      this.queryClient.invalidateQueries({ queryKey: ['events'] });
      this.queryClient.invalidateQueries({ queryKey: ['participants'] });
    },
  }));

  private _getEvents(context: QueryFunctionContext) {
    const [_, from, to] = context.queryKey;
    const params = new HttpParams()
      .set('from', String(from))
      .set('to', String(to));

    return lastValueFrom(
      this.http
        .get<CalendarEvent[]>(`${environment.backendApi}/events`, { params })
        .pipe(map(events => events.map(event => new CalendarEvent(event))))
    );
  }

  private _getParticipants() {
    return lastValueFrom(
      this.http.get<Participant[]>(`${environment.backendApi}/participants`)
    );
  }

  private _createEvent(event: CalendarEvent) {
    return lastValueFrom(
      this.http.post<CalendarEvent>(`${environment.backendApi}/events`, event)
    );
  }

  private _deleteEvent(id: string | number) {
    return lastValueFrom(
      this.http.delete<void>(`${environment.backendApi}/events/${id}`)
    );
  }

  private _updateEvent(variables: { calendarEvent: CalendarEvent }) {
    return lastValueFrom(
      this.http.patch<CalendarEvent>(
        `${environment.backendApi}/events/${variables.calendarEvent.id}`,
        variables.calendarEvent
      )
    );
  }

  private _getQueryOptions() {
    return {
      staleTime: Infinity, // Data never becomes stale
      gcTime: Infinity, // Data never gets garbage collected
      refetchOnWindowFocus: false, // Don't refetch when window regains focus
      refetchOnReconnect: false, // Don't refetch when reconnecting to network
      refetchOnMount: false, // Don't refetch when component mounts
    };
  }
}
