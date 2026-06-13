import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AuthService } from '../../core/services/auth.service';
import { MainPages } from '../../shared/models/pages';
import { AdminDrawerComponent } from './components/admin-drawer/admin-drawer.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NzIconModule, AdminDrawerComponent],
})
export class AdminComponent {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  protected isDrawerVisible = signal(false);

  protected openDrawer(): void {
    this.isDrawerVisible.set(true);
  }

  protected closeDrawer(): void {
    this.isDrawerVisible.set(false);
  }

  protected navigateToCalendar(): void {
    this.router.navigate([MainPages.Calendar]);
  }

  protected signOut(): void {
    this.authService.logout();
  }
}
