import { inject, Injectable, Signal } from '@angular/core';
import { injectMutation, injectQuery, QueryClient, skipToken } from '@tanstack/angular-query-experimental';
import {
  CreateCustomFieldDto,
  CustomFieldApi,
  SaveCustomFieldValuesDto,
  UpdateCustomFieldDto,
} from '../../../core/api/custom-field.api';
import { QueryKeys } from '../../../core/api/query-keys';
import { QueryOptions } from '../../../core/api/query-options';

export interface SaveValuesRequest {
  participantId: string | number;
  dto: SaveCustomFieldValuesDto;
}

@Injectable({ providedIn: 'root' })
export class CustomFieldService {
  private readonly api = inject(CustomFieldApi);
  private readonly queryClient = inject(QueryClient);

  public createValuesQuery(participantId: Signal<string | number | null>) {
    return injectQuery(() => {
      const id = participantId();
      return {
        queryKey: QueryKeys.customFieldValues.byParticipant(id ?? ''),
        queryFn: id == null ? skipToken : () => this.api.getValues(id),
        ...QueryOptions.cachedUntilInvalidated(),
      } as const;
    });
  }

  public readonly createMutation = injectMutation(() => ({
    mutationFn: (dto: CreateCustomFieldDto) => this.api.create(dto),
    onSuccess: () => this.invalidateAll(),
  }));

  public readonly updateMutation = injectMutation(() => ({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateCustomFieldDto }) => this.api.update(id, dto),
    onSuccess: () => this.invalidateAll(),
  }));

  public readonly deleteMutation = injectMutation(() => ({
    mutationFn: (id: string) => this.api.delete(id),
    onSuccess: () => this.invalidateAll(),
  }));

  public readonly saveValuesMutation = injectMutation(() => ({
    mutationFn: ({ participantId, dto }: SaveValuesRequest) => this.api.saveValues(participantId, dto),
    onSettled: (_data: void | undefined, _error: Error | null, { participantId }: SaveValuesRequest) =>
      this.queryClient.invalidateQueries({ queryKey: QueryKeys.customFieldValues.byParticipant(participantId) }),
  }));

  private invalidateAll(): Promise<void> {
    return this.queryClient.invalidateQueries({ queryKey: QueryKeys.customFieldValues.all() });
  }
}
