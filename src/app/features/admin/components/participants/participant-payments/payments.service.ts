import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { injectMutation, QueryClient } from '@tanstack/angular-query-experimental';
import { lastValueFrom, map } from 'rxjs';
import { apiUrl } from '../../../../../core/api/api-url';
import { ApiEndpoints } from '../../../../../core/api/endpoints';
import { QueryKeys } from '../../../../../core/api/query-keys';
import { CalendarEvent } from '../../../../calendar/models/calendar-event.model';

@Injectable({ providedIn: 'root' })
export class PaymentsService {
  private readonly http = inject(HttpClient);
  private readonly queryClient = inject(QueryClient);

  public getEventsForRange(from: string, to: string) {
    const params = new HttpParams().set('from', from).set('to', to);
    return lastValueFrom(
      this.http
        .get<CalendarEvent[]>(apiUrl(ApiEndpoints.Events.getAll), { params })
        .pipe(map((events) => events.map((event) => new CalendarEvent(event))))
    );
  }

  public readonly updateStatusMutation = injectMutation(() => ({
    mutationFn: (body: { studentId: string | number; eventId: string | number; date: string; isPaid: boolean }) => {
      const url = apiUrl(ApiEndpoints.Events.payments(body.eventId));

      if (body.isPaid) {
        return lastValueFrom(this.http.post<void>(url, { occurrenceDate: body.date }));
      } else {
        const params = new HttpParams().set('occurrenceDate', body.date);
        return lastValueFrom(this.http.delete<void>(url, { params }));
      }
    },
    onSuccess: () => {
      this.queryClient.invalidateQueries({
        queryKey: QueryKeys.events.all(),
      });
    },
  }));
}
