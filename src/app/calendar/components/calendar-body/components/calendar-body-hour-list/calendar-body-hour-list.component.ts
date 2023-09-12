import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CELL_HEIGHT } from '../../../../../shared/const/cellHeight';

@Component({
  selector: 'app-calendar-body-hour-list',
  templateUrl: './calendar-body-hour-list.component.html',
  styleUrls: ['./calendar-body-hour-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarBodyHourListComponent {
  hours = new Array(14);
  cellHeight = CELL_HEIGHT;
}
