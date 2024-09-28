import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EventService } from '../../services/event.service';
import { map, Observable } from 'rxjs';
import { CalendarEvent } from '../../models/calendarEvent.model';

@Component({
    selector: 'app-calendar-header',
    templateUrl: './calendar-header.component.html',
    styleUrls: ['./calendar-header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarHeaderComponent {
    protected weekEarnings$: Observable<number> =
        this.eventService.events$.pipe(
            map(events => events.reduce((acc, event) => acc + event.price, 0))
        );

    protected workingHoursAmount$: Observable<number> =
        this.eventService.events$.pipe(
            map(this.eventsToHoursAmount.bind(this))
        );

    constructor(private eventService: EventService) {}

    private eventsToHoursAmount(events: CalendarEvent[]): number {
        return events.reduce((acc, event) => {
            const [finishHours, finishMinutes] = event.finishTime
                .split(':')
                .map(Number);
            const [startHours, startMinutes] = event.startTime
                .split(':')
                .map(Number);

            const hoursDifference = finishHours - startHours;
            const minutesDifference = finishMinutes - startMinutes;

            return acc + hoursDifference + minutesDifference / 60;
        }, 0);
    }
}
