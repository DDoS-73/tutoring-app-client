import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { CalendarEvent } from '../../models/calendar-event.model';
import { CalendarConfig } from '../../models/calendar.config';
import { Tile } from '../../models/tile.model';
import { EventService } from '../../services/event.service';

interface EventStyles {
  height: string;
  top: string;
  zIndex: number;
  left: string;
  width: string;
  backgroundColor: string;
  boxShadow: string;
}

@Component({
  selector: 'app-calendar-tile',
  templateUrl: './calendar-tile.component.html',
  styleUrl: './calendar-tile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarTileComponent implements AfterViewInit {
  public tile = input.required<Tile>();
  public updateEvent = output<CalendarEvent>();

  private readonly _elRef = inject(ElementRef);
  private readonly _eventService = inject(EventService);

  protected events = this._eventService.eventsQuery.data;

  private tileHeight = signal<number>(0);
  private tileWidth = signal<number>(0);

  ngAfterViewInit(): void {
    this.tileHeight.set(this._elRef.nativeElement.offsetHeight);
    this.tileWidth.set(this._elRef.nativeElement.offsetWidth);
  }

  protected getEventStyles(event: CalendarEvent): EventStyles {
    const leftOffset = this._getEventLeftOffset(event);
    return {
      height: this._getEventHeight(event) + 'px',
      top: this._getEventTopOffset(event) + 'px',
      zIndex: this._getEventZIndex(event),
      left: leftOffset + 'px',
      width: leftOffset ? this.tileWidth() - leftOffset + 'px' : '100%',
      backgroundColor: event.color,
      boxShadow: leftOffset ? '0 0 10px 0 rgba(0, 0, 0, 0.3)' : 'none',
    };
  }

  private _getEventHeight(event: CalendarEvent): number {
    const tileHeight = this.tileHeight();
    if (!tileHeight) return 0;

    const eventDurationInMinutes = this._getEventDurationInMinutes(event);

    return tileHeight * (eventDurationInMinutes / 60);
  }

  private _getEventTopOffset(event: CalendarEvent): number {
    const tileHeight = this.tileHeight();
    if (!tileHeight) return 0;

    const eventStartTimeMinutes = event.startTime.getMinutes();

    return tileHeight * (eventStartTimeMinutes / 60);
  }

  private _getEventZIndex(event: CalendarEvent): number {
    const eventDurationInMinutes = this._getEventDurationInMinutes(event);
    const totalMinutesOnCalendarGrid = CalendarConfig.hoursAmount * 60;
    return totalMinutesOnCalendarGrid - eventDurationInMinutes;
  }

  private _getEventLeftOffset(event: CalendarEvent): number {
    return this._isEventTimeCollision(event) ? this.tileWidth() / 4 : 0;
  }

  private _getEventDurationInMinutes(event: CalendarEvent): number {
    const eventDurationInMilliseconds = event.endTime.getTime() - event.startTime.getTime();
    return eventDurationInMilliseconds / 1000 / 60;
  }

  private _isEventTimeCollision(tileEvent: CalendarEvent): boolean {
    const events: CalendarEvent[] = this.events() ?? [];
    const tileEventDurationInMinutes = this._getEventDurationInMinutes(tileEvent);
    return events.some((event) => {
      const eventDurationInMinutes = this._getEventDurationInMinutes(event);
      const isStartTimeCollision =
        tileEvent.startTime.getTime() >= event.startTime.getTime() &&
        tileEvent.startTime.getTime() <= event.startTime.getTime() + 15 * 60 * 1000 &&
        tileEventDurationInMinutes < eventDurationInMinutes;

      const isEventTimeCollision =
        tileEvent.startTime.getTime() > event.startTime.getTime() &&
        tileEvent.startTime.getTime() < event.endTime.getTime();
      return tileEvent.id !== event.id && (isStartTimeCollision || isEventTimeCollision);
    });
  }
}
