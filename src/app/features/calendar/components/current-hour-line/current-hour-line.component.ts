import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CalendarConfig } from '../../models/calendar.config';

const CALENDAR_TOP_OFFSET = 59; // Weekdays header height (58px + 1px border)
const HOUR_HEIGHT = 60; // Base min-height of calendar tile
const ROW_GAP = 1; // 1px gap in CSS Grid

@Component({
  selector: 'app-current-hour-line',
  templateUrl: './current-hour-line.component.html',
  styleUrl: './current-hour-line.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  host: {
    '[style.top.px]': 'topPosition',
    '[style.display]': 'isHidden ? "none" : "block"',
  },
})
export class CurrentHourLineComponent {
  private now = new Date();

  protected isHidden = this.now.getHours() > CalendarConfig.endHour || this.now.getHours() < CalendarConfig.startHour;

  protected topPosition = this.calculateTopPosition();

  private calculateTopPosition(): number {
    const currentHour = this.now.getHours();
    const elapsedHours = currentHour - CalendarConfig.startHour + this.now.getMinutes() / 60;
    const completedHours = Math.floor(elapsedHours);
    const fractionOfHour = elapsedHours - completedHours;

    return CALENDAR_TOP_OFFSET + completedHours * (HOUR_HEIGHT + ROW_GAP) + fractionOfHour * HOUR_HEIGHT;
  }
}
