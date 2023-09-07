import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DateService } from '../../../calendar/services/DateService/date.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  actualMonthEarnings = 500;
  predictedMonthEarnings = 1000;

  actualWeekEarnings = 100;
  predictedWeekEarnings = 200;

  constructor(public dateService: DateService) {}
}
