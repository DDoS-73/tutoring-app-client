import { Directive, DoCheck, ElementRef, Input } from '@angular/core';
import { DateService } from '../services/DateService/date.service';

@Directive({
    selector: '[appHighlightToday]',
})
export class HighlightTodayDirective implements DoCheck {
    @Input({ required: true }) day!: number;

    constructor(
        private elRef: ElementRef,
        private dateService: DateService
    ) {}

    ngDoCheck() {
        const date = this.dateService.getWeekDayByIndex(this.day - 1);
        const today = new Date();
        if (
            today.getDate() === date.getDate() &&
            today.getMonth() === date.getMonth()
        ) {
            this.elRef.nativeElement.classList.add('highlight_today');
        } else {
            this.elRef.nativeElement.classList.remove('highlight_today');
        }
    }
}
