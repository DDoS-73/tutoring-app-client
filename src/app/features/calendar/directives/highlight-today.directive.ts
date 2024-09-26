import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { DateService } from '../services/date.service';

@Directive({
    selector: '[appHighlightToday]',
})
export class HighlightTodayDirective implements OnInit {
    @Input({ required: true }) day!: number;

    constructor(
        private el: ElementRef,
        private dateService: DateService
    ) {}

    ngOnInit() {
        const date = this.dateService.getWeekDayByIndex(this.day - 1);
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
