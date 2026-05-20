import { ChangeDetectionStrategy, Component, computed, inject, signal, TemplateRef, viewChild } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { ParticipantService } from '../../../../core/services/participant.service';
import { Participant } from '../../../../shared/models/participant.model';

@Component({
  selector: 'app-participants',
  templateUrl: './participants.component.html',
  styleUrl: './participants.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NzIconModule, NzModalModule, NzSpinModule],
})
export class ParticipantsComponent {
  private readonly participantService = inject(ParticipantService);
  private readonly modal = inject(NzModalService);
  private readonly message = inject(NzMessageService);
  private readonly deleteConfirmTpl = viewChild.required<TemplateRef<void>>('deleteConfirmTpl');

  protected readonly participantsQuery = this.participantService.participantsQuery;
  protected readonly deleteMutation = this.participantService.deleteParticipantMutation;
  protected readonly deletingName = signal('');

  protected readonly participantRows = computed(() =>
    (this.participantsQuery.data() ?? []).map((p) => ({
      ...p,
      initials: ParticipantsComponent.toInitials(p.name),
    }))
  );

  private static toInitials(name: string): string {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  protected onDelete(participant: Participant): void {
    const id = participant.id;
    if (id == null) return;
    this.deletingName.set(participant.name);
    this.modal.confirm({
      nzTitle: 'Видалити учасника?',
      nzContent: this.deleteConfirmTpl(),
      nzOkText: 'Видалити',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzCancelText: 'Скасувати',
      nzIconType: 'delete',
      nzCentered: true,
      nzOnOk: () =>
        new Promise((resolve, reject) => {
          this.deleteMutation.mutate(id, {
            onSuccess: () => resolve(true),
            onError: () => {
              this.message.error('Не вдалося видалити учасника. Спробуйте ще раз.');
              reject();
            },
          });
        }),
    });
  }
}
