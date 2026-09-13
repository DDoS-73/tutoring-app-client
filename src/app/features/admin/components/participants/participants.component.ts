import { ChangeDetectionStrategy, Component, computed, inject, signal, TemplateRef, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { ParticipantService } from '../../../../core/services/participant.service';
import { ConfirmBodyComponent } from '../../../../shared/components/confirm-body/confirm-body.component';
import { ParticipantRow, toParticipantRows } from '../../../../shared/models/participant-row.model';
import { EventParticipantType } from '../../../../shared/models/participant.model';
import { AppModalService } from '../../../../shared/services/app-modal.service';
import { AddParticipantModalComponent } from './add-participant-modal/add-participant-modal.component';

@Component({
  selector: 'app-participants',
  templateUrl: './participants.component.html',
  styleUrl: './participants.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NzIconModule,
    NzModalModule,
    NzSpinModule,
    NzTabsModule,
    FormsModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    ConfirmBodyComponent,
  ],
})
export class ParticipantsComponent {
  private readonly participantService = inject(ParticipantService);
  private readonly modal = inject(AppModalService);
  private readonly message = inject(NzMessageService);
  private readonly router = inject(Router);
  private readonly archiveConfirmTpl = viewChild.required<TemplateRef<void>>('archiveConfirmTpl');
  private readonly deleteConfirmTpl = viewChild.required<TemplateRef<void>>('deleteConfirmTpl');

  protected readonly activeQuery = this.participantService.participantsQuery;
  protected readonly archivedQuery = this.participantService.archivedParticipantsQuery;
  protected readonly archiveMutation = this.participantService.archiveMutation;
  protected readonly unarchiveMutation = this.participantService.unarchiveMutation;
  protected readonly deleteMutation = this.participantService.deleteMutation;
  protected readonly createMutation = this.participantService.createMutation;

  protected readonly archivingName = signal('');
  protected readonly deletingName = signal('');
  protected readonly searchQuery = signal('');

  protected readonly hasSelection = signal(false);

  protected readonly activeRows = computed(() => toParticipantRows(this.activeQuery.data() ?? []));
  protected readonly archivedRows = computed(() => toParticipantRows(this.archivedQuery.data() ?? []));

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

  protected onArchive(participant: ParticipantRow): void {
    const id = participant.id;
    if (id == null) return;
    this.archivingName.set(participant.name);
    this.modal.confirmDanger({
      title: 'Archive Participant?',
      content: this.archiveConfirmTpl(),
      okText: 'Archive',
      iconType: 'container',
      onOk: () =>
        new Promise((resolve, reject) => {
          this.archiveMutation.mutate(id, {
            onSuccess: () => {
              if (this.isParticipantRouteActive(id)) {
                this.router.navigateByUrl('/admin/participants');
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
        if (this.isParticipantRouteActive(id)) {
          this.router.navigateByUrl('/admin/participants');
        }
      },
      onError: () => this.message.error('Failed to restore participant. Please try again.'),
    });
  }

  protected onDelete(participant: ParticipantRow): void {
    const id = participant.id;
    if (id == null) return;
    this.deletingName.set(participant.name);
    this.modal.confirmDanger({
      title: 'Delete Participant?',
      content: this.deleteConfirmTpl(),
      okText: 'Delete',
      iconType: 'delete',
      onOk: () =>
        new Promise((resolve, reject) => {
          this.deleteMutation.mutate(id, {
            onSuccess: () => {
              if (this.isParticipantRouteActive(id)) {
                this.router.navigateByUrl('/admin/participants');
              }
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

  protected onAddParticipant(): void {
    this.modal.openForm(AddParticipantModalComponent);
  }

  private isParticipantRouteActive(id: string | number): boolean {
    return this.router.url.startsWith(`/admin/participants/${id}`);
  }
}
