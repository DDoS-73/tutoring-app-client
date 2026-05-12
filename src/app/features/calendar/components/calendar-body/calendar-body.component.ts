import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  Signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { CalendarEvent } from '../../models/calendar-event.model';
import { Tile } from '../../models/tile.model';
import { DateService } from '../../services/date.service';
import { EventService } from '../../services/event.service';
import { CalendarTileComponent } from '../calendar-tile/calendar-tile.component';
import { CreateEventModalComponent } from '../create-event-modal/create-event-modal.component';
import { UpdateEventModalComponent } from '../update-event-modal/update-event-modal.component';
import { HighlightTodayDirective } from './../../directives/highlight-today.directive';
import { CalendarConfig } from './../../models/calendar.config';
import { HourPipe } from './../../pipes/hour.pipe';

@Component({
  selector: 'app-calendar-body',
  templateUrl: './calendar-body.component.html',
  styleUrls: ['./calendar-body.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    HighlightTodayDirective,
    HourPipe,
    CreateEventModalComponent,
    NzModalModule,
    UpdateEventModalComponent,
    CalendarTileComponent,
    NzIconModule,
    NgTemplateOutlet,
  ],
})
export class CalendarBodyComponent {
  private createEventModal = viewChild.required<TemplateRef<never>>('createEventModal');
  protected createEventModalRef?: NzModalRef<any>;

  private updateEventModal = viewChild.required<TemplateRef<never>>('updateEventModal');
  protected updateEventModalRef?: NzModalRef<any>;

  public week = input.required<Date[]>();
  public events = input.required<CalendarEvent[]>();

  private readonly dialog = inject(NzModalService);
  private readonly eventService = inject(EventService);
  protected readonly dateService = inject(DateService);

  protected tiles: Signal<Tile[]> = this._getTiles();
  protected isDataLoading = this._getIsDataLoading();
  protected readonly CalendarConfig = CalendarConfig;

  public openCreateDialog(tile?: Tile) {
    let startTime: Date;
    let endTime: Date;

    if (tile) {
      startTime = tile.startTime;
      endTime = tile.endTime;
    } else {
      const start = new Date();
      start.setMinutes(0, 0, 0);
      const nextHour = start.getHours() + 1;
      start.setHours(Math.min(Math.max(nextHour, CalendarConfig.startHour), CalendarConfig.endHour));
      startTime = start;
      const end = new Date(start);
      end.setHours(end.getHours() + 1);
      endTime = end;
    }

    const calendarEvent: Partial<CalendarEvent> = { startTime, endTime };
    this.createEventModalRef = this.dialog.create({
      nzTitle: 'Створення події',
      nzContent: this.createEventModal(),
      nzFooter: null,
      nzData: { calendarEvent },
      nzCentered: true,
      nzAutofocus: null,
    });
  }

  protected openUpdateDialog(calendarEvent: CalendarEvent) {
    this.updateEventModalRef = this.dialog.create({
      nzTitle: 'Редагування події',
      nzContent: this.updateEventModal(),
      nzFooter: null,
      nzData: {
        calendarEvent,
      },
      nzCentered: true,
      nzAutofocus: null,
    });
  }

  private _getIsDataLoading(): Signal<boolean> {
    return computed(
      () => this.eventService.eventsQuery.isFetching() || this.eventService.participantsQuery.isFetching()
    );
  }

  private _getTiles(): Signal<Tile[]> {
    return computed(() => {
      const events: CalendarEvent[] = this.events() ?? [];

      const weekDays: Date[] = this.dateService.currentWeekDays();
      const totalTiles: number = weekDays.length * CalendarConfig.hoursAmount;

      return new Array(totalTiles).fill(null).map((_, i) => {
        const dayIndex: number = i % 7;
        const hourIndex: number = Math.floor(i / 7) + CalendarConfig.startHour;

        const dayDate: Date = weekDays[dayIndex];

        const startTime = new Date(dayDate);
        startTime.setHours(hourIndex, 0, 0, 0);

        const endTime = new Date(dayDate);
        endTime.setHours(hourIndex + 1, 0, 0, 0);

        const tileEvents = events.filter((event) => {
          const eventStart = event.startTime;
          return eventStart >= startTime && eventStart < endTime;
        });

        return {
          startTime,
          endTime,
          events: tileEvents,
        };
      });
    });
  }
}
