import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-hide-toggle',
  templateUrl: './hide-toggle.component.html',
  styleUrl: './hide-toggle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HideToggleComponent {
  public readonly isHidden = input.required<boolean>();
  public readonly label = input.required<string>();
  public readonly disabled = input(false);
  public readonly toggled = output<void>();
}
