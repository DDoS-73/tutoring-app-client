import { ChangeDetectionStrategy, Component, inject, model } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-admin-drawer',
  templateUrl: './admin-drawer.component.html',
  styleUrl: './admin-drawer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, NzIconModule, NzDrawerModule],
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
