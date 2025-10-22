import { Directive, ElementRef, input, OnInit } from '@angular/core';
import { DateService } from '../services/date.service';

@Directive({
  selector: '[appHighlightToday]',
})
export class HighlightTodayDirective implements OnInit {
  public dayIndex = input.required<number>();

  constructor(
    private el: ElementRef,
    private dateService: DateService
  ) {}

  ngOnInit() {
    const days = this.dateService.weekDays();

    const date = days[this.dayIndex()];
    const today = new Date();
    if (
      today.getDate() === date.getDate() &&
      today.getMonth() === date.getMonth()
    ) {
      this.el.nativeElement.classList.add('highlight_today');
    } else {
      this.el.nativeElement.classList.remove('highlight_today');
    }
  }
}
