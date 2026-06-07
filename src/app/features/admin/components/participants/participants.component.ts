import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal, TemplateRef, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { ParticipantService } from '../../../../core/services/participant.service';
import { EventParticipantType, Participant } from '../../../../shared/models/participant.model';
import { AddParticipantModalComponent } from './add-participant-modal/add-participant-modal.component';
import { toInitials, getAvatarColor } from '../../../../shared/utils';

export interface ParticipantRow extends Participant {
  initials: string;
  avatarColor: string;
}

@Component({
  selector: 'app-participants',
  templateUrl: './participants.component.html',
  styleUrl: './participants.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NzIconModule, NzModalModule, NzSpinModule, NzTabsModule, FormsModule, NgTemplateOutlet],
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
  protected readonly createMutation = this.participantService.createMutation;

  protected readonly archivingName = signal('');
  protected readonly searchQuery = signal('');
  protected readonly selectedParticipant = signal<ParticipantRow | null>(null);

  protected readonly EventParticipantType = EventParticipantType;

  protected readonly activeRows = computed(() => this.toRows(this.activeQuery.data() ?? []));
  protected readonly archivedRows = computed(() => this.toRows(this.archivedQuery.data() ?? []));

  protected readonly filteredActiveRows = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const rows = this.activeRows();
    if (!query) return rows;
    return rows.filter((r) => r.name.toLowerCase().includes(query));
  });

  protected readonly filteredArchivedRows = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const rows = this.archivedRows();
    if (!query) return rows;
    return rows.filter((r) => r.name.toLowerCase().includes(query));
  });

  protected readonly activeStudents = computed(() =>
    this.filteredActiveRows().filter(
      (r) => r.type === EventParticipantType.Student || r.type === undefined || r.type === null
    )
  );

  protected readonly activeGroups = computed(() =>
    this.filteredActiveRows().filter((r) => r.type === EventParticipantType.Group)
  );

  protected readonly archivedStudents = computed(() =>
    this.filteredArchivedRows().filter(
      (r) => r.type === EventParticipantType.Student || r.type === undefined || r.type === null
    )
  );

  protected readonly archivedGroups = computed(() =>
    this.filteredArchivedRows().filter((r) => r.type === EventParticipantType.Group)
  );

  private toRows(data: Participant[]): ParticipantRow[] {
    return data.map((p) => ({
      ...p,
      initials: toInitials(p.name),
      avatarColor: getAvatarColor(p.name),
      isArchived: p.isArchived ?? false,
    }));
  }

  protected selectParticipant(p: ParticipantRow): void {
    this.selectedParticipant.set(p);
  }

  protected clearSelection(): void {
    this.selectedParticipant.set(null);
  }

  protected onArchive(participant: ParticipantRow): void {
    const id = participant.id;
    if (id == null) return;
    this.archivingName.set(participant.name);
    this.modal.confirm({
      nzTitle: 'Archive Participant?',
      nzContent: this.archiveConfirmTpl(),
      nzOkText: 'Archive',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzCancelText: 'Cancel',
      nzIconType: 'container',
      nzCentered: true,
      nzClassName: 'teachup-confirm-modal',
      nzOnOk: () =>
        new Promise((resolve, reject) => {
          this.archiveMutation.mutate(id, {
            onSuccess: () => {
              if (this.selectedParticipant()?.id === id) {
                this.selectedParticipant.set(null);
              }
              resolve(true);
            },
            onError: () => {
              this.message.error('Failed to archive participant. Please try again.');
              reject();
            },
          });
        }),
    });
  }

  protected onUnarchive(participant: ParticipantRow): void {
    const id = participant.id;
    if (id == null) return;
    this.unarchiveMutation.mutate(id, {
      onSuccess: () => {
        if (this.selectedParticipant()?.id === id) {
          this.selectedParticipant.set(null);
        }
      },
      onError: () => this.message.error('Не вдалося розархівувати учасника. Спробуйте ще раз.'),
    });
  }

  protected onAddParticipant(): void {
    this.modal.create<AddParticipantModalComponent>({
      nzContent: AddParticipantModalComponent,
      nzFooter: null,
      nzTitle: undefined,
      nzClosable: false,
      nzCentered: true,
      nzWidth: 560,
      nzClassName: 'teachup-modal',
    });
  }

  protected onEditParticipant(participant: ParticipantRow): void {
    const id = participant.id;
    if (id == null) return;
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

    modalRef.afterClose.subscribe((result) => {
      if (result) {
        if (result.action === 'delete') {
          this.onArchive(participant);
        } else if (result.updated) {
          this.selectedParticipant.set({
            ...participant,
            name: result.updated.name,
            type: result.updated.type,
            price: result.updated.price,
            initials: toInitials(result.updated.name),
            avatarColor: getAvatarColor(result.updated.name),
          });
        }
      }
    });
  }
}
