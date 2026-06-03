import { BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { map } from 'rxjs';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AuthSchedulePanelComponent } from '../auth-schedule-panel/auth-schedule-panel.component';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, AuthSchedulePanelComponent, NzIconModule],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthLayoutComponent {
  title = input.required<string>();
  subtitle = input.required<string>();
  mobileTitle = input.required<string>();
  mobileSubtitle = input.required<string>();

  protected readonly isMobile = toSignal(
    inject(BreakpointObserver)
      .observe('(max-width: 1023px)')
      .pipe(map((state) => state.matches)),
    { initialValue: false }
  );
}
