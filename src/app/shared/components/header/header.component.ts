import { ChangeDetectionStrategy, Component } from '@angular/core';
// import { DateService } from '../../../features/calendar/services/DateService/date.service';
// import { EarningsService } from '../../../features/calendar/services/EarningsService/earnings.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
    constructor() {} // public earningService: EarningsService // public dateService: DateService,

    // onCurrentWeekClick() {
    //   this.dateService.updateWeekDays(new Date());
    // }
}
