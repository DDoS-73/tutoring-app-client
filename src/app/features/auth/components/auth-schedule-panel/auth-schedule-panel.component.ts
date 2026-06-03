import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-auth-schedule-panel',
  standalone: true,
  imports: [],
  templateUrl: './auth-schedule-panel.component.html',
  styleUrl: './auth-schedule-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthSchedulePanelComponent {}
