import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
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
import { ParticipantSelectionService } from '../../services/participant-selection.service';
import { AddParticipantModalComponent } from './add-participant-modal/add-participant-modal.component';
import { BulkActionBarComponent } from './bulk-action-bar/bulk-action-bar.component';
import { ParticipantRowComponent } from './participant-row/participant-row.component';

@Component({
  selector: 'app-participants',
  templateUrl: './participants.component.html',
  styleUrl: './participants.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ParticipantSelectionService],
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
    ParticipantRowComponent,
    BulkActionBarComponent,
  ],
})
export class ParticipantsComponent {
  private readonly participantService = inject(ParticipantService);
  private readonly modal = inject(AppModalService);
  private readonly archiveConfirmTpl = viewChild.required<TemplateRef<void>>('archiveConfirmTpl');
  private readonly deleteConfirmTpl = viewChild.required<TemplateRef<void>>('deleteConfirmTpl');
  private readonly bulkArchiveConfirmTpl = viewChild.required<TemplateRef<void>>('bulkArchiveConfirmTpl');
  private readonly bulkUnarchiveConfirmTpl = viewChild.required<TemplateRef<void>>('bulkUnarchiveConfirmTpl');
  private readonly bulkDeleteConfirmTpl = viewChild.required<TemplateRef<void>>('bulkDeleteConfirmTpl');

  protected readonly commands = inject(ParticipantCommandsService);
  protected readonly selection = inject(ParticipantSelectionService);

  protected readonly activeQuery = this.participantService.participantsQuery;
  protected readonly archivedQuery = this.participantService.archivedParticipantsQuery;
  protected readonly archiveMutation = this.participantService.archiveMutation;
  protected readonly unarchiveMutation = this.participantService.unarchiveMutation;
  protected readonly deleteMutation = this.participantService.deleteMutation;
  protected readonly createMutation = this.participantService.createMutation;

  protected readonly searchQuery = signal('');
  protected readonly hasSelection = signal(false);
  protected readonly selectedTabIndex = signal(0);

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

  protected readonly isArchivedTab = computed(() => this.selectedTabIndex() === 1);

  private readonly visibleRows = computed<ParticipantRow[]>(() =>
    this.isArchivedTab()
      ? [...this.archivedStudents(), ...this.archivedGroups()]
      : [...this.activeStudents(), ...this.activeGroups()]
  );

  private readonly selectedRows = computed<ParticipantRow[]>(() => {
    const ids = this.selection.selectedIds();
    return this.visibleRows().filter((r) => r.id != null && ids.has(String(r.id)));
  });

  constructor() {
    effect(() => this.selection.setScope(this.visibleRows()));
  }

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

  protected onEnterSelectMode(): void {
    this.selection.enter();
  }

  protected onCancelSelectMode(): void {
    this.selection.exit();
  }

  protected onToggleSelectAll(): void {
    this.selection.toggleAll();
  }

  protected onTabIndexChange(index: number): void {
    this.selectedTabIndex.set(index);
    this.selection.exit();
  }

  protected onBulkArchive(): void {
    this.commands.archiveMany(this.selectedRows(), this.bulkArchiveConfirmTpl(), () => this.selection.exit());
  }

  protected onBulkUnarchive(): void {
    this.commands.unarchiveMany(this.selectedRows(), this.bulkUnarchiveConfirmTpl(), () => this.selection.exit());
  }

  protected onBulkDelete(): void {
    this.commands.deleteMany(this.selectedRows(), this.bulkDeleteConfirmTpl(), () => this.selection.exit());
  }
}
