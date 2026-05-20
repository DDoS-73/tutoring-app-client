import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { injectMutation, injectQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { lastValueFrom, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Participant } from '../../shared/models/participant.model';
import { ApiEndpoints } from '../api/endpoints';

@Injectable({ providedIn: 'root' })
export class ParticipantService {
  private readonly http = inject(HttpClient);
  private readonly queryClient = inject(QueryClient);

  public readonly participantsQuery = injectQuery(() => ({
    queryKey: ['participants'],
    queryFn: () =>
      lastValueFrom(
        this.http
          .get<Participant[]>(`${environment.backendApi}${ApiEndpoints.Participants.getAll}`)
          .pipe(map((participants) => participants.sort((a, b) => a.name.localeCompare(b.name))))
      ),
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  }));

  public readonly deleteParticipantMutation = injectMutation(() => ({
    mutationFn: (id: string | number) =>
      lastValueFrom(this.http.delete<void>(`${environment.backendApi}${ApiEndpoints.Participants.delete(id)}`)),
    onSuccess: () => {
      this.queryClient.invalidateQueries({ queryKey: ['events'] });
      this.queryClient.invalidateQueries({ queryKey: ['participants'] });
    },
  }));
}
