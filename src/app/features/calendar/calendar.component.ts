import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  HostListener,
  inject,
  Signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';
import { CalendarBodyComponent } from './components/calendar-body/calendar-body.component';
import { CalendarHeaderComponent } from './components/calendar-header/calendar-header.component';
import { CurrentHourLineComponent } from './components/current-hour-line/current-hour-line.component';
import { DateService } from './services/date.service';
import { EventService } from './services/event.service';

const SWIPE_THRESHOLD = 0.25;

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DateService, EventService],
  imports: [CalendarBodyComponent, CalendarHeaderComponent, CurrentHourLineComponent],
})
export class CalendarComponent implements AfterViewInit {
  private readonly container = viewChild.required<ElementRef>('container');
  private readonly _dateService = inject(DateService);
  private readonly _eventService = inject(EventService);
  private readonly _dr = inject(DestroyRef);

  protected weeks: Signal<Date[][]> = computed(() => [
    this._dateService.previousWeekDays(),
    this._dateService.currentWeekDays(),
    this._dateService.nextWeekDays(),
  ]);

  protected events = this._eventService.eventsQuery.data;

  ngAfterViewInit(): void {
    this._moveCalendarOnStartPosition();
    this._initTouchEventsListener();
  }

  @HostListener('window:resize')
  onResize() {
    this._moveCalendarOnStartPosition();
  }

  private _moveCalendarOnStartPosition(): void {
    const container: HTMLElement = this.container().nativeElement;
    const clientWidth = container.scrollWidth / 3;
    this._applyTransform(container, clientWidth, false);
  }

  private _initTouchEventsListener() {
    const container: HTMLElement = this.container().nativeElement;
    const clientWidth = container.scrollWidth / 3;

    let startX = 0;
    let startY = 0;
    let lockedDirection: 'x' | 'y' | null = null;
    let xShift = 0;

    fromEvent<TouchEvent>(container, 'touchstart')
      .pipe(takeUntilDestroyed(this._dr))
      .subscribe((e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        lockedDirection = null;
      });

    fromEvent<TouchEvent>(container, 'touchmove')
      .pipe(takeUntilDestroyed(this._dr))
      .subscribe((e) => {
        const dx = Math.abs(e.touches[0].clientX - startX);
        const dy = Math.abs(e.touches[0].clientY - startY);

        if (!lockedDirection) {
          lockedDirection = dx > dy ? 'x' : 'y';
        }

        xShift = -1 * (e.touches[0].clientX - startX);
        this._applyTransform(container, clientWidth + xShift);

        if (xShift > clientWidth * SWIPE_THRESHOLD) {
          this._swipeToNextWeek(container, clientWidth);
        } else if (xShift < -clientWidth * SWIPE_THRESHOLD) {
          this._swipeToPreviousWeek(container, clientWidth);
        }
      });

    fromEvent<TouchEvent>(container, 'touchend')
      .pipe(takeUntilDestroyed(this._dr))
      .subscribe(() => {
        if (xShift < clientWidth * SWIPE_THRESHOLD && xShift > -clientWidth * SWIPE_THRESHOLD) {
          this._applyTransform(container, clientWidth);
        }
      });
  }

  private _swipeToNextWeek(container: HTMLElement, clientWidth: number) {
    const nextWeekDay = this._dateService.currentWeekDays()[0];
    nextWeekDay.setDate(nextWeekDay.getDate() + 7);
    this._dateService.updateAllWeeksDays(nextWeekDay);

    this._applyTransform(container, clientWidth * 2);
    setTimeout(() => {
      this._applyTransform(container, clientWidth, false);
    }, 200);
  }

  private _swipeToPreviousWeek(container: HTMLElement, clientWidth: number) {
    const previousWeekDay = this._dateService.currentWeekDays()[0];
    previousWeekDay.setDate(previousWeekDay.getDate() - 7);
    this._dateService.updateAllWeeksDays(previousWeekDay);

    this._applyTransform(container, 0);
    setTimeout(() => {
      this._applyTransform(container, clientWidth, false);
    }, 200);
  }

  private _applyTransform(container: HTMLElement, shift: number, transition: boolean = true) {
    if (transition) {
      container.style.transition = 'transform 0.3s ease';
    } else {
      container.style.transition = 'none';
    }
    container.style.transform = `translateX(${-shift}px)`;
  }
}
