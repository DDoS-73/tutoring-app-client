import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    OnInit,
} from '@angular/core';
import { EventService } from '../../services/event.service';
import { map, Observable } from 'rxjs';
import { CalendarEvent } from '../../models/calendar-event.model';
import { FormControl, FormGroup } from '@angular/forms';
import { CalendarFilters } from '../../models/calendar-filters.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-calendar-header',
    templateUrl: './calendar-header.component.html',
    styleUrls: ['./calendar-header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarHeaderComponent implements OnInit {
    protected filtersForm = new FormGroup({
        isPaid: new FormControl(''),
        workObjectId: new FormControl(''),
    });

    protected expectedWeekEarnings$: Observable<number> =
        this.eventService.events$.pipe(
            map(events => events.reduce((acc, event) => acc + event.price, 0))
        );
    protected actualWeekEarnings$: Observable<number> =
        this.eventService.events$.pipe(
            map(events =>
                events.reduce(
                    (acc, event) => acc + (event.isPaid ? event.price : 0),
                    0
                )
            )
        );
    protected workingHoursAmount$: Observable<number> =
        this.eventService.events$.pipe(
            map(this.eventsToHoursAmount.bind(this))
        );

    protected readonly workObjectOptions$ = this.eventService.workObjects$.pipe(
        map(workObjects =>
            workObjects.map(({ name, id }) => ({ name, value: id }))
        )
    );

    protected readonly paidOptions = [
        {
            name: 'Оплачені',
            value: true,
        },
        {
            name: 'Неоплачені',
            value: false,
        },
    ];

    constructor(
        private eventService: EventService,
        private dr: DestroyRef
    ) {}

    ngOnInit() {
        this.filtersForm.valueChanges
            .pipe(takeUntilDestroyed(this.dr))
            .subscribe(filters =>
                this.eventService.setFilters(filters as CalendarFilters)
            );
    }

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
