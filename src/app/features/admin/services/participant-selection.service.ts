import { computed, Injectable, signal } from '@angular/core';
import { ParticipantRow } from '../../../shared/models/participant-row.model';

@Injectable()
export class ParticipantSelectionService {
  public readonly selectMode = signal(false);

  private readonly scopeIds = signal<ReadonlySet<string>>(new Set());
  private readonly rawIds = signal<ReadonlySet<string>>(new Set());

  public readonly selectedIds = computed<ReadonlySet<string>>(() => {
    const scope = this.scopeIds();
    const raw = this.rawIds();
    return new Set([...raw].filter((id) => scope.has(id)));
  });

  public readonly selectedCount = computed(() => this.selectedIds().size);

  public readonly allSelected = computed(() => {
    const scope = this.scopeIds();
    return scope.size > 0 && [...scope].every((id) => this.selectedIds().has(id));
  });

  public setScope(rows: ParticipantRow[]): void {
    this.scopeIds.set(new Set(rows.filter((r) => r.id != null).map((r) => String(r.id))));
  }

  public isSelected(id: string | number | undefined): boolean {
    if (id == null) return false;
    return this.selectedIds().has(String(id));
  }

  public toggle(id: string | number | undefined): void {
    if (id == null) return;
    const key = String(id);
    this.rawIds.update((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  public toggleAll(): void {
    if (this.allSelected()) {
      this.rawIds.set(new Set());
      return;
    }
    this.rawIds.set(new Set(this.scopeIds()));
  }

  public enter(): void {
    this.selectMode.set(true);
  }

  public exit(): void {
    this.selectMode.set(false);
    this.rawIds.set(new Set());
  }
}
