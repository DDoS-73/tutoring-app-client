import { computed, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { ParticipantService } from '../../../../../core/services/participant.service';

@Injectable()
export class ParticipantDetailService {
  private readonly route = inject(ActivatedRoute);
  private readonly participantService = inject(ParticipantService);

  private readonly id = toSignal(this.route.paramMap.pipe(map((p) => p.get('id'))));

  readonly participant = this.participantService.participantById(this.id);

  readonly isResolving = computed(
    () =>
      this.participantService.participantsQuery.isPending() ||
      this.participantService.archivedParticipantsQuery.isPending()
  );
}
