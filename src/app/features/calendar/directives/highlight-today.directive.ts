import {
    DestroyRef,
    Directive,
    ElementRef,
    Input,
    OnInit,
} from '@angular/core';
import { DateService } from '../services/date.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Directive({
    selector: '[appHighlightToday]',
})
export class HighlightTodayDirective implements OnInit {
    @Input({ required: true }) day!: number;

    constructor(
        private el: ElementRef,
        private dateService: DateService,
        private dr: DestroyRef
    ) {}

    ngOnInit() {
        this.dateService.weekDays$
            .pipe(takeUntilDestroyed(this.dr))
            .subscribe(days => {
                const date = days[this.day - 1];
                const today = new Date();
                if (
                    today.getDate() === date.getDate() &&
                    today.getMonth() === date.getMonth()
                ) {
                    this.el.nativeElement.classList.add('highlight_today');
                } else {
                    this.el.nativeElement.classList.remove('highlight_today');
                }
            });
    }
}
