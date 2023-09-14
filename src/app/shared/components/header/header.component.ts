import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DateService } from '../../../calendar/services/DateService/date.service';
import { EarningsService } from '../../../calendar/services/EarningsService/earnings.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  constructor(
    public dateService: DateService,
    public earningService: EarningsService
  ) {}
}
