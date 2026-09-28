import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-basic-field-block',
  templateUrl: './basic-field-block.component.html',
  styleUrl: './basic-field-block.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.boxed]': 'boxed()',
    '[attr.role]': 'boxed() ? "group" : null',
    '[attr.aria-label]': 'boxed() ? label() : null',
  },
})
export class BasicFieldBlockComponent {
  public readonly label = input.required<string>();
  public readonly inputId = input<string>();
  public readonly boxed = input(false);
}
