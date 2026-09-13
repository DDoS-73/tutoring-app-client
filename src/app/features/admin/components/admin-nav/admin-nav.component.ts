import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AdminPages } from '../../../../shared/models/pages';

export type AdminNavVariant = 'sidebar' | 'drawer';

@Component({
  selector: 'app-admin-nav',
  templateUrl: './admin-nav.component.html',
  styleUrl: './admin-nav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, NzIconModule],
  host: {
    '[class.variant-drawer]': "variant() === 'drawer'",
  },
})
export class AdminNavComponent {
  public readonly variant = input<AdminNavVariant>('sidebar');
  public readonly navigated = output<void>();
  public readonly signOut = output<void>();

  protected readonly participantsPath = AdminPages.Participants;
}
