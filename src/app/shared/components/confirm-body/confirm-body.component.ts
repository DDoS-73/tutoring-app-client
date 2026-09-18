import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type ConfirmBodyAction = 'archive' | 'unarchive' | 'delete';

@Component({
  selector: 'app-confirm-body',
  templateUrl: './confirm-body.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmBodyComponent {
  public readonly name = input('');
  public readonly count = input<number>();
  public readonly action = input.required<ConfirmBodyAction>();

  protected readonly bulkBody = computed(() => {
    const n = this.count() ?? 0;
    const plural = n === 1 ? 'participant' : 'participants';
    switch (this.action()) {
      case 'archive':
        return `${n} ${plural} will be moved to Archived. You can restore ${n === 1 ? 'it' : 'them'} anytime.`;
      case 'unarchive':
        return `${n} ${plural} will be restored to Active.`;
      case 'delete':
        return `${n} ${plural} and ${n === 1 ? 'its' : 'their'} lesson history will be permanently deleted. This cannot be undone.`;
    }
  });
}
