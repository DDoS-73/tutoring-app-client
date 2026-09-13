import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type ConfirmBodyAction = 'archive' | 'delete';

@Component({
  selector: 'app-confirm-body',
  templateUrl: './confirm-body.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmBodyComponent {
  public readonly name = input.required<string>();
  public readonly action = input.required<ConfirmBodyAction>();
}
