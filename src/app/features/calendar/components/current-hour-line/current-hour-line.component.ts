import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CalendarConfig } from '../../models/calendar.config';

const HEADER_HEIGHT = 64;

@Component({
  selector: 'app-current-hour-line',
  templateUrl: './current-hour-line.component.html',
  styleUrl: './current-hour-line.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  host: {
    '[style.top.px]': '40 + topOffset',
    '[style.display]': 'isHidden ? "none" : "block"',
  },
})
export class CurrentHourLineComponent {
  private oneHourHeight = (window.innerHeight - 40 - HEADER_HEIGHT) / CalendarConfig.hoursAmount;

  private now = new Date();

  protected isHidden = this.now.getHours() > CalendarConfig.endHour || this.now.getHours() < CalendarConfig.startHour;
  protected topOffset =
    (this.now.getHours() - CalendarConfig.startHour + this.now.getMinutes() / 60) * this.oneHourHeight;
}
