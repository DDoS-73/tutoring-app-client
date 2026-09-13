import { HttpClient, HttpParams } from '@angular/common/http';
import { computed, inject, Injectable, Signal } from '@angular/core';
import { injectMutation, injectQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { lastValueFrom, map } from 'rxjs';
import { ParticipantRow, toParticipantRows } from '../../shared/models/participant-row.model';
import { EventParticipantType, Participant } from '../../shared/models/participant.model';
import { apiUrl } from '../api/api-url';
import { ApiEndpoints } from '../api/endpoints';
import { QueryKeys } from '../api/query-keys';
import { cachedForever } from '../api/query-options';

@Injectable({ providedIn: 'root' })
export class ParticipantService {
  private readonly http = inject(HttpClient);
  private readonly queryClient = inject(QueryClient);

  public readonly participantsQuery = injectQuery(() => ({
    queryKey: QueryKeys.participants.active(),
    queryFn: () =>
      lastValueFrom(
        this.http
          .get<Participant[]>(apiUrl(ApiEndpoints.Participants.getAll))
          .pipe(map((ps) => ps.sort((a, b) => a.name.localeCompare(b.name))))
      ),
    ...cachedForever(),
  }));

  public readonly archivedParticipantsQuery = injectQuery(() => ({
    queryKey: QueryKeys.participants.archived(),
    queryFn: () =>
      lastValueFrom(
        this.http
          .get<Participant[]>(apiUrl(ApiEndpoints.Participants.getAll), {
            params: new HttpParams().set('isArchived', 'true'),
          })
          .pipe(map((ps) => ps.sort((a, b) => a.name.localeCompare(b.name))))
      ),
    ...cachedForever(),
  }));

  public readonly allRows = computed<ParticipantRow[]>(() => [
    ...toParticipantRows(this.participantsQuery.data() ?? []),
    ...toParticipantRows(this.archivedParticipantsQuery.data() ?? []),
  ]);

  public participantById(id: Signal<string | null | undefined>): Signal<ParticipantRow | null> {
    return computed(() => {
      const key = id();
      if (key == null) return null;
      return this.allRows().find((r) => String(r.id) === key) ?? null;
    });
  }

  public readonly createMutation = injectMutation(() => ({
    mutationFn: (dto: { name: string; type: EventParticipantType; price: number }) =>
      lastValueFrom(this.http.post<Participant>(apiUrl(ApiEndpoints.Participants.create), dto)),
    onSuccess: () => {
      this.queryClient.invalidateQueries({ queryKey: QueryKeys.participants.all() });
    },
  }));

  public readonly updateMutation = injectMutation(() => ({
    mutationFn: ({
      id,
      dto,
    }: {
      id: string | number;
      dto: { name: string; type: EventParticipantType; price: number };
    }) => lastValueFrom(this.http.patch<void>(apiUrl(ApiEndpoints.Participants.update(id)), dto)),
    onSuccess: () => {
      this.queryClient.invalidateQueries({ queryKey: QueryKeys.participants.all() });
    },
  }));

  public readonly archiveMutation = injectMutation(() => ({
    mutationFn: (id: string | number) =>
      lastValueFrom(this.http.post<void>(apiUrl(ApiEndpoints.Participants.archive(id)), null)),
    onSuccess: () => {
      this.queryClient.invalidateQueries({ queryKey: QueryKeys.participants.all() });
      this.queryClient.invalidateQueries({ queryKey: QueryKeys.events.all() });
    },
  }));

  public readonly unarchiveMutation = injectMutation(() => ({
    mutationFn: (id: string | number) =>
      lastValueFrom(this.http.post<void>(apiUrl(ApiEndpoints.Participants.unarchive(id)), null)),
    onSuccess: () => {
      this.queryClient.invalidateQueries({ queryKey: QueryKeys.participants.all() });
    },
  }));

  public readonly deleteMutation = injectMutation(() => ({
    mutationFn: (id: string | number) =>
      lastValueFrom(this.http.delete<void>(apiUrl(ApiEndpoints.Participants.delete(id)))),
    onSuccess: () => {
      this.queryClient.invalidateQueries({ queryKey: QueryKeys.participants.all() });
      this.queryClient.invalidateQueries({ queryKey: QueryKeys.events.all() });
    },
  }));
}
