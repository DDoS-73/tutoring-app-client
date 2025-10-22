import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { NzModalModule, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { CalendarEvent } from '../../models/calendar-event.model';
import { Tile } from '../../models/tile.model';
import { DateService } from '../../services/date.service';
import { EventService } from '../../services/event.service';
import { CreateEventModalComponent } from '../create-event-modal/create-event-modal.component';
import { HighlightTodayDirective } from './../../directives/highlight-today.directive';
import { CalendarConfig } from './../../models/calendar.config';
import { HourPipe } from './../../pipes/hour.pipe';
import { UpdateEventModalComponent } from '../update-event-modal/update-event-modal.component';

@Component({
  selector: 'app-calendar-body',
  templateUrl: './calendar-body.component.html',
  styleUrls: ['./calendar-body.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    HighlightTodayDirective,
    HourPipe,
    NgTemplateOutlet,
    CreateEventModalComponent,
    NzModalModule,
    UpdateEventModalComponent,
  ],
})
export class CalendarBodyComponent {
  private createEventModal =
    viewChild.required<TemplateRef<never>>('createEventModal');
  protected createEventModalRef?: NzModalRef<any>;

  private updateEventModal =
    viewChild.required<TemplateRef<never>>('updateEventModal');
  protected updateEventModalRef?: NzModalRef<any>;

  private readonly dialog = inject(NzModalService);
  private readonly eventService = inject(EventService);
  protected readonly dateService = inject(DateService);

  protected events = this.eventService.eventsQuery.data;
  protected tiles: Signal<Tile[]> = this._getTiles();
  protected readonly CalendarConfig = CalendarConfig;

  protected openCreateDialog(tile: Tile) {
    const calendarEvent: Partial<CalendarEvent> = {
      startTime: tile.startTime,
      endTime: tile.endTime,
    };
    this.createEventModalRef = this.dialog.create({
      nzTitle: 'Створення події',
      nzContent: this.createEventModal(),
      nzFooter: null,
      nzData: {
        calendarEvent,
      },
      nzCentered: true,
      nzWidth: '50vw',
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
      nzWidth: '50vw',
    });
  }

  private _getTiles(): Signal<Tile[]> {
    return computed(() => {
      const events = this.events() ?? [];
      const weekDays = this.dateService.weekDays();
      const totalTiles = weekDays.length * CalendarConfig.hoursAmount;

      return new Array(totalTiles).fill(null).map((_, i) => {
        const dayIndex = i % 7;
        const hourIndex = Math.floor(i / 7) + 8;

        const dayDate = weekDays[dayIndex];

        const startTime = new Date(dayDate);
        startTime.setHours(hourIndex, 0, 0, 0);

        const endTime = new Date(dayDate);
        endTime.setHours(hourIndex + 1, 0, 0, 0);

        const tileEvents = events.filter(event => {
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
