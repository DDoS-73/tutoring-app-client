import { ChangeDetectionStrategy, Component, inject, model } from '@angular/core';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AuthService } from '../../../../core/services/auth.service';
import { AdminNavComponent } from '../admin-nav/admin-nav.component';

@Component({
  selector: 'app-admin-drawer',
  templateUrl: './admin-drawer.component.html',
  styleUrl: './admin-drawer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NzIconModule, NzDrawerModule, AdminNavComponent],
})
export class AdminDrawerComponent {
  private readonly authService = inject(AuthService);

  readonly visible = model<boolean>(false);

  protected closeDrawer(): void {
    this.visible.set(false);
  }

  protected signOut(): void {
    this.authService.logout();
    this.closeDrawer();
  }
}
