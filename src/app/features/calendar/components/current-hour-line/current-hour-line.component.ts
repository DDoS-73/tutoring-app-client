import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CalendarConfig } from '../../models/calendar.config';

const CALENDAR_TOP_OFFSET = 40;
const HEADER_HEIGHT = 64;
const MIN_HOUR_HEIGHT = 60.5;

@Component({
  selector: 'app-current-hour-line',
  templateUrl: './current-hour-line.component.html',
  styleUrl: './current-hour-line.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  host: {
    '[style.top.px]': 'calendarTopOffset + topOffset',
    '[style.display]': 'isHidden ? "none" : "block"',
  },
})
export class CurrentHourLineComponent {
  protected readonly calendarTopOffset = CALENDAR_TOP_OFFSET;

  private oneHourHeight = Math.max(
    MIN_HOUR_HEIGHT,
    (window.innerHeight - CALENDAR_TOP_OFFSET - HEADER_HEIGHT) / CalendarConfig.hoursAmount
  );

  private now = new Date();

  protected isHidden = this.now.getHours() > CalendarConfig.endHour || this.now.getHours() < CalendarConfig.startHour;
  protected topOffset =
    (this.now.getHours() - CalendarConfig.startHour + this.now.getMinutes() / 60) * this.oneHourHeight;
}
