import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AuthService } from '../../core/services/auth.service';
import { MainPages } from '../../shared/models/pages';
import { AdminDrawerComponent } from './components/admin-drawer/admin-drawer.component';
import { AdminNavComponent } from './components/admin-nav/admin-nav.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, NzIconModule, AdminDrawerComponent, AdminNavComponent],
})
export class AdminComponent {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  protected isDrawerVisible = signal(false);

  protected openDrawer(): void {
    this.isDrawerVisible.set(true);
  }

  protected navigateToCalendar(): void {
    this.router.navigate([MainPages.Calendar]);
  }

  protected signOut(): void {
    this.authService.logout();
  }
}
