import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CalendarConfig } from '../../models/calendar.config';

@Component({
  selector: 'app-current-hour-line',
  templateUrl: './current-hour-line.component.html',
  styleUrl: './current-hour-line.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  host: {
    '[style.top.px]': 'topOffset',
  },
})
export class CurrentHourLineComponent {
  private oneHourHeight = (window.innerHeight - 40) / CalendarConfig.hoursAmount;
  protected topOffset = (new Date().getHours() - CalendarConfig.startHour) * this.oneHourHeight;
}
