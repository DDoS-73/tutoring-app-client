import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, TemplateRef, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { ConfirmBodyComponent } from '../../../../../shared/components/confirm-body/confirm-body.component';
import { ParticipantRow, resolvePrice } from '../../../../../shared/models/participant-row.model';
import { EventParticipantType } from '../../../../../shared/models/participant.model';
import { AppModalService } from '../../../../../shared/services/app-modal.service';
import { ADMIN_PARTICIPANTS_PATH } from '../../../admin.paths';
import { isDeleteRequested, ParticipantModalResult } from '../../../models/participant-modal.model';
import { ParticipantCommandsService } from '../../../services/participant-commands.service';
import { AddParticipantModalComponent } from '../add-participant-modal/add-participant-modal.component';
import { ParticipantDetailService } from './participant-detail.service';

@Component({
  selector: 'app-participant-detail',
  templateUrl: './participant-detail.component.html',
  styleUrl: './participant-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NzIconModule,
    NzModalModule,
    NzSpinModule,
    NzTabsModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    ConfirmBodyComponent,
  ],
  // Provided here (the :id route) so the routed General/Payments tabs can inject the same
  // instance and read the participant it already resolved, instead of re-deriving it.
  providers: [ParticipantDetailService],
})
export class ParticipantDetailComponent {
  private readonly router = inject(Router);
  private readonly participantDetail = inject(ParticipantDetailService);
  private readonly modal = inject(AppModalService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly deleteConfirmTpl = viewChild.required<TemplateRef<void>>('deleteConfirmTpl');

  protected readonly commands = inject(ParticipantCommandsService);

  protected readonly EventParticipantType = EventParticipantType;
  protected readonly resolvePrice = resolvePrice;
  protected readonly participantsPath = ADMIN_PARTICIPANTS_PATH;

  protected readonly isResolving = this.participantDetail.isResolving;
  protected readonly participant = this.participantDetail.participant;

  constructor() {
    effect(() => {
      if (!this.isResolving() && this.participant() === null) {
        this.router.navigateByUrl(ADMIN_PARTICIPANTS_PATH);
      }
    });
  }

  protected onEdit(participant: ParticipantRow): void {
    const modalRef = this.modal.openForm<AddParticipantModalComponent, ParticipantModalResult>(
      AddParticipantModalComponent,
      participant
    );

    modalRef.afterClose.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((result) => {
      if (isDeleteRequested(result)) {
        this.onDelete(participant);
      }
    });
  }

  private onDelete(participant: ParticipantRow): void {
    this.commands.delete(participant, this.deleteConfirmTpl(), 'always');
  }
}
