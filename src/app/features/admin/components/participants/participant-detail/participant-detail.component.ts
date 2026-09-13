import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  TemplateRef,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { ParticipantService } from '../../../../../core/services/participant.service';
import { DEFAULT_PARTICIPANT_PRICE, EventParticipantType } from '../../../../../shared/models/participant.model';
import { ParticipantRow } from '../../../../../shared/models/participant-row.model';
import { AddParticipantModalComponent } from '../add-participant-modal/add-participant-modal.component';
import { ParticipantDetailService } from './participant-detail.service';

@Component({
  selector: 'app-participant-detail',
  templateUrl: './participant-detail.component.html',
  styleUrl: './participant-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NzIconModule, NzModalModule, NzSpinModule, NzTabsModule, RouterLink, RouterLinkActive, RouterOutlet],
  // Provided here (the :id route) so the routed General/Payments tabs can inject the same
  // instance and read the participant it already resolved, instead of re-deriving it.
  providers: [ParticipantDetailService],
})
export class ParticipantDetailComponent {
  private readonly router = inject(Router);
  private readonly participantDetail = inject(ParticipantDetailService);
  private readonly participantService = inject(ParticipantService);
  private readonly modal = inject(NzModalService);
  private readonly message = inject(NzMessageService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly deleteConfirmTpl = viewChild.required<TemplateRef<void>>('deleteConfirmTpl');

  protected readonly EventParticipantType = EventParticipantType;
  protected readonly DEFAULT_PARTICIPANT_PRICE = DEFAULT_PARTICIPANT_PRICE;

  private readonly deleteMutation = this.participantService.deleteMutation;

  protected readonly deletingName = signal('');

  protected readonly isResolving = this.participantDetail.isResolving;
  protected readonly participant = this.participantDetail.participant;

  constructor() {
    effect(() => {
      if (!this.isResolving() && this.participant() === null) {
        this.router.navigateByUrl('/admin/participants');
      }
    });
  }

  protected onEdit(participant: ParticipantRow): void {
    const modalRef = this.modal.create<AddParticipantModalComponent>({
      nzContent: AddParticipantModalComponent,
      nzFooter: null,
      nzTitle: undefined,
      nzClosable: false,
      nzCentered: true,
      nzWidth: 560,
      nzData: participant,
      nzClassName: 'teachup-modal',
    });

    modalRef.afterClose.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((result) => {
      if (result?.action === 'delete') {
        this.onDelete(participant);
      }
    });
  }

  private onDelete(participant: ParticipantRow): void {
    const id = participant.id;
    if (id == null) return;
    this.deletingName.set(participant.name);
    this.modal.confirm({
      nzTitle: 'Delete Participant?',
      nzContent: this.deleteConfirmTpl(),
      nzOkText: 'Delete',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzCancelText: 'Cancel',
      nzIconType: 'delete',
      nzCentered: true,
      nzClassName: 'teachup-confirm-modal',
      nzOnOk: () =>
        new Promise((resolve, reject) => {
          this.deleteMutation.mutate(id, {
            onSuccess: () => {
              this.router.navigateByUrl('/admin/participants');
              resolve(true);
            },
            onError: () => {
              this.message.error('Failed to delete participant. Please try again.');
              reject();
            },
          });
        }),
    });
  }
}
