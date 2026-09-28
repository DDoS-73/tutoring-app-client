import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { filter, map } from 'rxjs';
import { AdminPaths } from '../../../admin.paths';
import { ParticipantRow } from '../../../../../shared/models/participant-row.model';
import { ParticipantSelectionService } from '../../../services/participant-selection.service';

@Component({
  selector: 'li[app-participant-row]',
  templateUrl: './participant-row.component.html',
  styleUrl: './participant-row.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NzIconModule, RouterLink],
  host: {
    class: 'row-item',
    '[class.row-item--archived]': 'archived()',
    '[class.checked]': 'checked()',
    '[class.selected]': 'routeActive()',
    '[class.is-selecting]': 'selection.selectMode()',
    '(click)': 'onRowClick()',
  },
})
export class ParticipantRowComponent {
  protected readonly selection = inject(ParticipantSelectionService);
  private readonly router = inject(Router);

  public readonly participant = input.required<ParticipantRow>();
  public readonly archived = input(false);
  public readonly group = input(false);
  public readonly archivePending = input(false);
  public readonly unarchivePending = input(false);
  public readonly deletePending = input(false);

  public readonly archive = output<void>();
  public readonly unarchive = output<void>();
  public readonly delete = output<void>();

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => this.router.url)
    ),
    { initialValue: this.router.url }
  );

  protected readonly checked = computed(() => this.selection.isSelected(this.participant().id));
  protected readonly routeActive = computed(() => {
    const id = this.participant().id;
    if (id == null) return false;
    return this.currentUrl().startsWith(AdminPaths.participant(id));
  });

  protected onRowClick(): void {
    if (this.selection.selectMode()) {
      this.selection.toggle(this.participant().id);
    }
  }

  protected onCheckboxLabelClick(event: MouseEvent): void {
    event.stopPropagation();
  }

  protected onArchiveClick(event: MouseEvent): void {
    event.stopPropagation();
    this.archive.emit();
  }

  protected onUnarchiveClick(event: MouseEvent): void {
    event.stopPropagation();
    this.unarchive.emit();
  }

  protected onDeleteClick(event: MouseEvent): void {
    event.stopPropagation();
    this.delete.emit();
  }
}
