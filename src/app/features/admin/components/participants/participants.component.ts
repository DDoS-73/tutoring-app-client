import { ChangeDetectionStrategy, Component, computed, inject, signal, TemplateRef, viewChild } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { ParticipantService } from '../../../../core/services/participant.service';
import { Participant } from '../../../../shared/models/participant.model';

@Component({
  selector: 'app-participants',
  templateUrl: './participants.component.html',
  styleUrl: './participants.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NzIconModule, NzModalModule, NzSpinModule, NzTabsModule],
})
export class ParticipantsComponent {
  private readonly participantService = inject(ParticipantService);
  private readonly modal = inject(NzModalService);
  private readonly message = inject(NzMessageService);
  private readonly archiveConfirmTpl = viewChild.required<TemplateRef<void>>('archiveConfirmTpl');

  protected readonly activeQuery = this.participantService.participantsQuery;
  protected readonly archivedQuery = this.participantService.archivedParticipantsQuery;
  protected readonly archiveMutation = this.participantService.archiveMutation;
  protected readonly unarchiveMutation = this.participantService.unarchiveMutation;
  protected readonly archivingName = signal('');

  protected readonly activeRows = computed(() => this.toRows(this.activeQuery.data() ?? []));
  protected readonly archivedRows = computed(() => this.toRows(this.archivedQuery.data() ?? []));

  private toRows(data: Participant[]) {
    return data.map((p) => ({ ...p, initials: ParticipantsComponent.toInitials(p.name) }));
  }

  private static toInitials(name: string): string {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  protected onArchive(participant: Participant): void {
    const id = participant.id;
    if (id == null) return;
    this.archivingName.set(participant.name);
    this.modal.confirm({
      nzTitle: 'Архівувати учасника?',
      nzContent: this.archiveConfirmTpl(),
      nzOkText: 'Архівувати',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzCancelText: 'Скасувати',
      nzIconType: 'container',
      nzCentered: true,
      nzOnOk: () =>
        new Promise((resolve, reject) => {
          this.archiveMutation.mutate(id, {
            onSuccess: () => resolve(true),
            onError: () => {
              this.message.error('Не вдалося архівувати учасника. Спробуйте ще раз.');
              reject();
            },
          });
        }),
    });
  }

  protected onUnarchive(participant: Participant): void {
    const id = participant.id;
    if (id == null) return;
    this.unarchiveMutation.mutate(id, {
      onError: () => this.message.error('Не вдалося розархівувати учасника. Спробуйте ще раз.'),
    });
  }
}
