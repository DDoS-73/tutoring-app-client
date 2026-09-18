import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-bulk-action-bar',
  templateUrl: './bulk-action-bar.component.html',
  styleUrl: './bulk-action-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NzIconModule],
})
export class BulkActionBarComponent {
  public readonly count = input.required<number>();
  public readonly archived = input(false);

  public readonly archive = output<void>();
  public readonly unarchive = output<void>();
  public readonly delete = output<void>();
}
