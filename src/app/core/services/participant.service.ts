import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { injectMutation, injectQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { lastValueFrom, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Participant, EventParticipantType } from '../../shared/models/participant.model';
import { ApiEndpoints } from '../api/endpoints';

@Injectable({ providedIn: 'root' })
export class ParticipantService {
  private readonly http = inject(HttpClient);
  private readonly queryClient = inject(QueryClient);

  public readonly participantsQuery = injectQuery(() => ({
    queryKey: ['participants', 'active'],
    queryFn: () =>
      lastValueFrom(
        this.http
          .get<Participant[]>(`${environment.backendApi}${ApiEndpoints.Participants.getAll}`)
          .pipe(map((ps) => ps.sort((a, b) => a.name.localeCompare(b.name))))
      ),
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  }));

  public readonly archivedParticipantsQuery = injectQuery(() => ({
    queryKey: ['participants', 'archived'],
    queryFn: () =>
      lastValueFrom(
        this.http
          .get<Participant[]>(`${environment.backendApi}${ApiEndpoints.Participants.getAll}`, {
            params: new HttpParams().set('isArchived', 'true'),
          })
          .pipe(map((ps) => ps.sort((a, b) => a.name.localeCompare(b.name))))
      ),
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  }));

  public readonly createMutation = injectMutation(() => ({
    mutationFn: (dto: { name: string; type: EventParticipantType; price: number }) =>
      lastValueFrom(this.http.post<Participant>(`${environment.backendApi}${ApiEndpoints.Participants.create}`, dto)),
    onSuccess: () => {
      this.queryClient.invalidateQueries({ queryKey: ['participants'] });
    },
  }));

  public readonly updateMutation = injectMutation(() => ({
    mutationFn: ({ id, dto }: { id: string | number; dto: { name: string; type: EventParticipantType; price: number } }) =>
      lastValueFrom(this.http.patch<void>(`${environment.backendApi}${ApiEndpoints.Participants.update(id)}`, dto)),
    onSuccess: () => {
      this.queryClient.invalidateQueries({ queryKey: ['participants'] });
    },
  }));

  public readonly archiveMutation = injectMutation(() => ({
    mutationFn: (id: string | number) =>
      lastValueFrom(this.http.post<void>(`${environment.backendApi}${ApiEndpoints.Participants.archive(id)}`, null)),
    onSuccess: () => {
      this.queryClient.invalidateQueries({ queryKey: ['participants'] });
      this.queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  }));

  public readonly unarchiveMutation = injectMutation(() => ({
    mutationFn: (id: string | number) =>
      lastValueFrom(this.http.post<void>(`${environment.backendApi}${ApiEndpoints.Participants.unarchive(id)}`, null)),
    onSuccess: () => {
      this.queryClient.invalidateQueries({ queryKey: ['participants'] });
    },
  }));
}
