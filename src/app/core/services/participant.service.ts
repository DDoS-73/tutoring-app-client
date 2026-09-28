import { computed, inject, Injectable, Signal } from '@angular/core';
import { injectMutation, injectQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { ParticipantApi, ParticipantDto } from '../api/participant.api';
import { QueryKeys } from '../api/query-keys';
import { QueryOptions } from '../api/query-options';
import { ParticipantRow } from '../../shared/models/participant-row.model';

@Injectable({ providedIn: 'root' })
export class ParticipantService {
  private readonly api = inject(ParticipantApi);
  private readonly queryClient = inject(QueryClient);

  public readonly participantsQuery = injectQuery(() => ({
    queryKey: QueryKeys.participants.active(),
    queryFn: () => this.api.getActive(),
    ...QueryOptions.cachedForever(),
  }));

  public readonly archivedParticipantsQuery = injectQuery(() => ({
    queryKey: QueryKeys.participants.archived(),
    queryFn: () => this.api.getArchived(),
    ...QueryOptions.cachedForever(),
  }));

  public readonly activeRows = computed<ParticipantRow[]>(() =>
    ParticipantRow.fromList(this.participantsQuery.data() ?? [])
  );

  public readonly archivedRows = computed<ParticipantRow[]>(() =>
    ParticipantRow.fromList(this.archivedParticipantsQuery.data() ?? [])
  );

  public readonly allRows = computed<ParticipantRow[]>(() => [...this.activeRows(), ...this.archivedRows()]);

  public participantById(id: Signal<string | null | undefined>): Signal<ParticipantRow | null> {
    return computed(() => {
      const key = id();
      if (key == null) return null;
      return this.allRows().find((r) => String(r.id) === key) ?? null;
    });
  }

  public readonly createMutation = injectMutation(() => ({
    mutationFn: (dto: ParticipantDto) => this.api.create(dto),
    onSuccess: () => {
      this.queryClient.invalidateQueries({ queryKey: QueryKeys.participants.all() });
    },
  }));

  public readonly updateMutation = injectMutation(() => ({
    mutationFn: ({ id, dto }: { id: string | number; dto: ParticipantDto }) => this.api.update(id, dto),
    onSuccess: () => {
      this.queryClient.invalidateQueries({ queryKey: QueryKeys.participants.all() });
    },
  }));

  public readonly archiveMutation = injectMutation(() => ({
    mutationFn: (id: string | number) => this.api.archive(id),
    onSuccess: () => {
      this.queryClient.invalidateQueries({ queryKey: QueryKeys.participants.all() });
      this.queryClient.invalidateQueries({ queryKey: QueryKeys.events.all() });
    },
  }));

  public readonly unarchiveMutation = injectMutation(() => ({
    mutationFn: (id: string | number) => this.api.unarchive(id),
    onSuccess: () => {
      this.queryClient.invalidateQueries({ queryKey: QueryKeys.participants.all() });
    },
  }));

  public readonly deleteMutation = injectMutation(() => ({
    mutationFn: (id: string | number) => this.api.delete(id),
    onSuccess: () => {
      this.queryClient.invalidateQueries({ queryKey: QueryKeys.participants.all() });
      this.queryClient.invalidateQueries({ queryKey: QueryKeys.events.all() });
    },
  }));

  public readonly bulkArchiveMutation = injectMutation(() => ({
    mutationFn: (ids: (string | number)[]) => this.api.archiveMany(ids),
    onSuccess: () => {
      this.queryClient.invalidateQueries({ queryKey: QueryKeys.participants.all() });
      this.queryClient.invalidateQueries({ queryKey: QueryKeys.events.all() });
    },
  }));

  public readonly bulkUnarchiveMutation = injectMutation(() => ({
    mutationFn: (ids: (string | number)[]) => this.api.unarchiveMany(ids),
    onSuccess: () => {
      this.queryClient.invalidateQueries({ queryKey: QueryKeys.participants.all() });
    },
  }));

  public readonly bulkDeleteMutation = injectMutation(() => ({
    mutationFn: (ids: (string | number)[]) => this.api.deleteMany(ids),
    onSuccess: () => {
      this.queryClient.invalidateQueries({ queryKey: QueryKeys.participants.all() });
      this.queryClient.invalidateQueries({ queryKey: QueryKeys.events.all() });
    },
  }));
}
