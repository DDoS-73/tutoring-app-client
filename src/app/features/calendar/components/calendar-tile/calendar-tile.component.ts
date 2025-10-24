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
import { Tile } from '../../models/tile.model';

@Component({
  selector: 'app-calendar-tile',
  templateUrl: './calendar-tile.component.html',
  styleUrl: './calendar-tile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarTileComponent implements AfterViewInit {
  public tile = input.required<Tile>();
  public dayIndex = input.required<number>();
  public updateEvent = output<CalendarEvent>();

  private elRef = inject(ElementRef);

  private tileHeight = signal<number>(0);

  ngAfterViewInit(): void {
    this.tileHeight.set(this.elRef.nativeElement.offsetHeight);
  }

  protected getEventHeight(event: CalendarEvent): number {
    const tileHeight = this.tileHeight();
    if (!tileHeight) return 0;

    const eventDurationInMilliseconds =
      event.endTime.getTime() - event.startTime.getTime();

    return tileHeight * (eventDurationInMilliseconds / 1000 / 60 / 60);
  }

  protected getEventTopOffset(event: CalendarEvent): number {
    const tileHeight = this.tileHeight();
    if (!tileHeight) return 0;

    const eventStartTimeMinutes = event.startTime.getMinutes();

    return tileHeight * (eventStartTimeMinutes / 60);
  }
}
