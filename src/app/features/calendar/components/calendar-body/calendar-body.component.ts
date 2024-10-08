import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Inject,
    TemplateRef,
    ViewChild,
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { CalendarEvent } from '../../models/calendar-event.model';
import { EventService } from '../../services/event.service';
import { DialogConfig } from '../../../../shared/models/dialog.config';
import { CalendarEventModalData } from '../../models/calendar-event-modal.data';
import { DateService } from '../../services/date.service';
import {
    CALENDAR_CONFIG_TOKEN,
    CalendarConfig,
} from '../../models/calendar.config';

@Component({
    selector: 'app-calendar-body',
    templateUrl: './calendar-body.component.html',
    styleUrls: ['./calendar-body.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarBodyComponent implements AfterViewInit {
    @ViewChild('tile')
    protected tile!: ElementRef<HTMLElement>;

    @ViewChild('createEventModal')
    protected createEventModal!: TemplateRef<any>;
    protected createEventModalRef?: MatDialogRef<any>;

    @ViewChild('updateEventModal')
    protected updateEventModal!: TemplateRef<any>;
    protected updateEventModalRef?: MatDialogRef<any>;

    protected tiles = new Array(this.calendarConfig.hoursAmount * 7);
    protected hours = new Array(this.calendarConfig.hoursAmount);
    protected events$: Observable<CalendarEvent[]> = this.eventService.events$;

    get cellHeight(): number {
        return this.calendarConfig.cellHeight;
    }

    get cellWidth(): number {
        return this.calendarConfig.cellWidth;
    }

    constructor(
        private dialog: MatDialog,
        private eventService: EventService,
        protected dateService: DateService,
        @Inject(CALENDAR_CONFIG_TOKEN) protected calendarConfig: CalendarConfig,
        private cdr: ChangeDetectorRef
    ) {}

    ngAfterViewInit() {
        this.calendarConfig.setCellHeight(this.tile.nativeElement.clientHeight);
        this.calendarConfig.setCellWidth(
            this.tile.nativeElement.clientWidth + 0.5
        );
        this.cdr.detectChanges();
    }

    protected openCreateDialog(row: number, col: number) {
        const dialogConfig = new DialogConfig<CalendarEventModalData>();
        const calendarEvent: Partial<CalendarEvent> = {
            startTime: row + ':00',
            finishTime: row + 1 + ':00',
            date: this.dateService.getWeekDayByIndex(col - 1),
        };
        dialogConfig.data = { calendarEvent };
        this.createEventModalRef = this.dialog.open(
            this.createEventModal,
            dialogConfig
        );
    }

    protected openUpdateDialog(calendarEvent: CalendarEvent) {
        const dialogConfig = new DialogConfig<CalendarEventModalData>();
        dialogConfig.data = { calendarEvent };
        this.updateEventModalRef = this.dialog.open(
            this.updateEventModal,
            dialogConfig
        );
    }

    protected calculateDay(index: number): number {
        return (index + 1) % 7 ? (index + 1) % 7 : 7;
    }

    protected calculateRow(index: number): number {
        return Math.floor(index / 7);
    }

    protected createEvent(event: CalendarEvent) {
        this.eventService
            .createEvent(event)
            .subscribe(() => this.createEventModalRef?.close());
    }

    protected updateEvent(event: CalendarEvent, id: number) {
        this.eventService
            .updateEvent(event, id)
            .subscribe(() => this.updateEventModalRef?.close());
    }

    protected deleteEvent(id: number, all = false) {
        this.eventService
            .deleteEvent(id, all)
            .subscribe(() => this.updateEventModalRef?.close());
    }
}
