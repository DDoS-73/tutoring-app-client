import { ChangeDetectionStrategy, Component, computed, inject, signal, TemplateRef, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { ParticipantService } from '../../../../core/services/participant.service';
import { ConfirmBodyComponent } from '../../../../shared/components/confirm-body/confirm-body.component';
import { filterByName, isGroup, isStudent, ParticipantRow } from '../../../../shared/models/participant-row.model';
import { AppModalService } from '../../../../shared/services/app-modal.service';
import { ParticipantCommandsService } from '../../services/participant-commands.service';
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
  private readonly archiveConfirmTpl = viewChild.required<TemplateRef<void>>('archiveConfirmTpl');
  private readonly deleteConfirmTpl = viewChild.required<TemplateRef<void>>('deleteConfirmTpl');

  protected readonly commands = inject(ParticipantCommandsService);

  protected readonly activeQuery = this.participantService.participantsQuery;
  protected readonly archivedQuery = this.participantService.archivedParticipantsQuery;
  protected readonly archiveMutation = this.participantService.archiveMutation;
  protected readonly unarchiveMutation = this.participantService.unarchiveMutation;
  protected readonly deleteMutation = this.participantService.deleteMutation;
  protected readonly createMutation = this.participantService.createMutation;

  protected readonly searchQuery = signal('');
  protected readonly hasSelection = signal(false);

  private readonly filteredActiveRows = computed(() =>
    filterByName(this.participantService.activeRows(), this.searchQuery())
  );

  private readonly filteredArchivedRows = computed(() =>
    filterByName(this.participantService.archivedRows(), this.searchQuery())
  );

  protected readonly activeStudents = computed(() => this.filteredActiveRows().filter(isStudent));
  protected readonly activeGroups = computed(() => this.filteredActiveRows().filter(isGroup));
  protected readonly archivedStudents = computed(() => this.filteredArchivedRows().filter(isStudent));
  protected readonly archivedGroups = computed(() => this.filteredArchivedRows().filter(isGroup));

  protected onArchive(participant: ParticipantRow): void {
    this.commands.archive(participant, this.archiveConfirmTpl());
  }

  protected onUnarchive(participant: ParticipantRow): void {
    this.commands.unarchive(participant);
  }

  protected onDelete(participant: ParticipantRow): void {
    this.commands.delete(participant, this.deleteConfirmTpl(), 'if-active');
  }

  protected onAddParticipant(): void {
    this.modal.openForm(AddParticipantModalComponent);
  }
}
