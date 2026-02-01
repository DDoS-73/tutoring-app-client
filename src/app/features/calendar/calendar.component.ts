import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  Signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { auditTime, filter, fromEvent } from 'rxjs';
import { CalendarBodyComponent } from './components/calendar-body/calendar-body.component';
import { CalendarWeekSelectorComponent } from './components/calendar-week-selector/calendar-week-selector.component';
import { DateService } from './services/date.service';
import { EventService } from './services/event.service';

const SWIPE_WEEK_DURATION = 650;
const SWIPE_THRESHOLD = 0.2;

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DateService, EventService],
  imports: [CalendarBodyComponent, CalendarWeekSelectorComponent],
})
export class CalendarComponent implements AfterViewInit {
  private readonly _elRef = inject(ElementRef);
  private readonly _dateService = inject(DateService);
  private readonly _eventService = inject(EventService);
  private readonly _dr = inject(DestroyRef);

  protected weeks: Signal<Date[][]> = computed(() => [
    this._dateService.previousWeekDays(),
    this._dateService.currentWeekDays(),
    this._dateService.nextWeekDays(),
  ]);

  protected events = this._eventService.eventsQuery.data;

  private blockScrollListener = false;

  ngAfterViewInit(): void {
    const container: HTMLElement = this._elRef.nativeElement;
    const clientWidth = container.scrollWidth / 3;
    container.scrollLeft += clientWidth;

    this._initTouchEventsListener(container, clientWidth);
    this._initScrollEventsListener(container, clientWidth);
  }

  private _initTouchEventsListener(container: HTMLElement, clientWidth: number) {
    let startX = 0;
    let startY = 0;
    let lockedDirection: 'x' | 'y' | null = null;

    fromEvent<TouchEvent>(container, 'touchstart')
      .pipe(takeUntilDestroyed(this._dr))
      .subscribe((e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        lockedDirection = null;
      });

    fromEvent<TouchEvent>(container, 'touchmove', { passive: false })
      .pipe(
        filter(() => !this.blockScrollListener),
        takeUntilDestroyed(this._dr)
      )
      .subscribe((e) => {
        const dx = Math.abs(e.touches[0].clientX - startX);
        const dy = Math.abs(e.touches[0].clientY - startY);

        if (!lockedDirection) {
          lockedDirection = dx > dy ? 'x' : 'y';
        }

        if (lockedDirection === 'x') {
          e.preventDefault();
          const scrollDiff = e.touches[0].clientX - startX;
          this._swipeToWeek(container, clientWidth, -scrollDiff);
        }
      });
  }

  private _initScrollEventsListener(container: HTMLElement, clientWidth: number) {
    fromEvent(container, 'scroll')
      .pipe(
        filter(() => !this.blockScrollListener),
        auditTime(100),
        takeUntilDestroyed(this._dr)
      )
      .subscribe(() => {
        const scrollDiff = Math.floor(container.scrollLeft - clientWidth);
        this._swipeToWeek(container, clientWidth, scrollDiff);
      });
  }

  private _swipeToWeek(container: HTMLElement, clientWidth: number, scrollDiff: number) {
    if (scrollDiff > clientWidth * SWIPE_THRESHOLD) {
      this._swipeToNextWeek(container, clientWidth);
    } else if (scrollDiff < -clientWidth * SWIPE_THRESHOLD) {
      this._swipeToPreviousWeek(container, clientWidth);
    } else {
      container.scrollLeft = clientWidth;
    }
  }

  private _swipeToNextWeek(container: HTMLElement, clientWidth: number) {
    this.blockScrollListener = true;
    container.scrollTo({ left: container.scrollLeft + clientWidth, top: 0, behavior: 'smooth' });
    const nextWeekDay = this._dateService.currentWeekDays()[0];
    nextWeekDay.setDate(nextWeekDay.getDate() + 7);

    setTimeout(() => {
      this._dateService.updateAllWeeksDays(nextWeekDay);
      container.scrollLeft = clientWidth;
      this.blockScrollListener = false;
    }, SWIPE_WEEK_DURATION);
  }

  private _swipeToPreviousWeek(container: HTMLElement, clientWidth: number) {
    this.blockScrollListener = true;
    container.scrollTo({ left: container.scrollLeft - clientWidth, top: 0, behavior: 'smooth' });
    const previousWeekDay = this._dateService.currentWeekDays()[0];
    previousWeekDay.setDate(previousWeekDay.getDate() - 7);

    setTimeout(() => {
      this._dateService.updateAllWeeksDays(previousWeekDay);
      container.scrollLeft = clientWidth;
      this.blockScrollListener = false;
    }, SWIPE_WEEK_DURATION);
  }
}
