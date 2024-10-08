import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgxMaterialTimepickerTheme } from 'ngx-material-timepicker';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { EventService } from '../../services/event.service';
import { map, Observable, startWith, withLatestFrom } from 'rxjs';
import { WorkObject } from '../../models/work-object.model';
import { CalendarEvent } from '../../models/calendar-event.model';
import { CustomDateAdapter } from '../../models/week-selector/custom-date.adapter';
import { RecurrenceTypes } from '../../models/recurred-pattern.model';

@Component({
    selector: 'app-event-form',
    templateUrl: './event-form.component.html',
    styleUrls: ['./event-form.component.scss'],
    providers: [
        { provide: DateAdapter, useClass: CustomDateAdapter },
        { provide: MAT_DATE_LOCALE, useValue: 'uk' },
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventFormComponent implements OnInit {
    @Input({ required: true }) event!: Partial<CalendarEvent>;
    @Output() eventFormSubmit = new EventEmitter<CalendarEvent>();

    protected eventForm!: FormGroup;
    protected filteredWorkObjects$!: Observable<WorkObject[]>;

    protected readonly repeatableOptions = [
        {
            name: 'Не повторювати',
            value: '',
        },
        {
            name: 'Щодня',
            value: RecurrenceTypes.Daily,
        },
        {
            name: 'Щотижня',
            value: RecurrenceTypes.Weekly,
        },
        {
            name: 'Щомісяця',
            value: RecurrenceTypes.Monthly,
        },
    ];

    get workObjectControl() {
        return this.eventForm.controls['workObject'];
    }

    constructor(private eventService: EventService) {}

    ngOnInit() {
        this.eventForm = new FormGroup({
            workObject: new FormControl(this.event.workObject?.name ?? ''),
            price: new FormControl(this.event?.price ?? 0),
            date: new FormControl(this.event?.date ?? new Date()),
            startTime: new FormControl(this.event?.startTime ?? '00:00'),
            finishTime: new FormControl(this.event?.finishTime ?? '01:00'),
            repeatable: new FormControl(this.event?.repeatable ?? ''),
            isPaid: new FormControl(this.event?.isPaid ?? false),
        });

        this.filteredWorkObjects$ = this.workObjectControl.valueChanges.pipe(
            startWith(''),
            withLatestFrom(this.eventService.workObjects$),
            map(([value, workObjects]) => {
                const name = typeof value === 'string' ? value : value?.name;
                return name
                    ? workObjects.filter(workObject =>
                          workObject.name
                              .toLowerCase()
                              .includes(name.toLowerCase())
                      )
                    : workObjects.slice();
            })
        );
    }

    protected darkTheme: NgxMaterialTimepickerTheme = {
        container: {
            bodyBackgroundColor: '#424242',
            buttonColor: '#fff',
        },
        dial: {
            dialBackgroundColor: '#555',
        },
        clockFace: {
            clockFaceBackgroundColor: '#555',
            clockHandColor: '#9fbd90',
            clockFaceTimeInactiveColor: '#fff',
        },
    };
}
