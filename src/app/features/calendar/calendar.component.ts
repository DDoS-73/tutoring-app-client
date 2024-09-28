import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
    CALENDAR_CONFIG_TOKEN,
    CalendarConfig,
} from './models/calendar.config';
import { DateService } from './services/date.service';
import { EarningsService } from './services/earnings.service';
import { EventService } from './services/event.service';

@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.component.html',
    styleUrl: './calendar.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: CALENDAR_CONFIG_TOKEN,
            useValue: new CalendarConfig(),
        },
        DateService,
        EarningsService,
        EventService,
    ],
})
export class CalendarComponent {}
