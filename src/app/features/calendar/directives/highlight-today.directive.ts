import { Directive, effect, ElementRef, inject, Injector, input, OnInit } from '@angular/core';
import { DateService } from '../services/date.service';

@Directive({
  selector: '[appHighlightToday]',
})
export class HighlightTodayDirective implements OnInit {
  public dayIndex = input.required<number>();

  private readonly _el = inject(ElementRef);
  private readonly _dateService = inject(DateService);
  private readonly _injector = inject(Injector);

  ngOnInit() {
    this._highlightTodayEffect();
  }

  private _highlightTodayEffect() {
    effect(
      () => {
        const days = this._dateService.currentWeekDays();
        const dayIndex = this.dayIndex();
        const date = days[dayIndex];
        const today = new Date();
        const isHighlighted =
          today.getFullYear() === date.getFullYear() &&
          today.getMonth() === date.getMonth() &&
          today.getDate() === date.getDate();
        this._el.nativeElement.classList.toggle('highlight_today', isHighlighted);
      },
      { injector: this._injector }
    );
  }
}
