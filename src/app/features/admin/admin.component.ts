import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AuthService } from '../../core/services/auth.service';
import { MainPages } from '../../shared/models/pages';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NzIconModule],
})
export class AdminComponent {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  protected navigateToCalendar(): void {
    this.router.navigate([MainPages.Calendar]);
  }

  protected signOut(): void {
    this.authService.logout();
  }
}
