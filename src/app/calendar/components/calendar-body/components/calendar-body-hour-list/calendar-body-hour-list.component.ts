import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  CALENDAR_BODY_HEIGHT,
  CELL_HEIGHT,
} from '../../../../../shared/const/cellHeight';
import {
  DISPLAYED_HOURS,
  HOURS_AMOUNT,
} from '../../../../../shared/const/hoursAmount';

@Component({
  selector: 'app-calendar-body-hour-list',
  templateUrl: './calendar-body-hour-list.component.html',
  styleUrls: ['./calendar-body-hour-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarBodyHourListComponent {
  hours = new Array(HOURS_AMOUNT);
  cellHeight = CELL_HEIGHT;
  DISPLAYED_HOURS = DISPLAYED_HOURS;
  calendarBodyHeight = CALENDAR_BODY_HEIGHT + 'px';
}
