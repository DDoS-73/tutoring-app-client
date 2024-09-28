import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    OnInit,
} from '@angular/core';
import { MAT_DATE_RANGE_SELECTION_STRATEGY } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { CustomDateAdapter } from '../../models/week-selector/custom-date.adapter';
import { WeekRangeSelectionStrategy } from '../../models/week-selector/week-range-selection.strategy';
import { FormControl, FormGroup } from '@angular/forms';
import { DateService } from '../../services/date.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, take } from 'rxjs';
import { WeekSelector } from '../../models/week-selector/week-selector.data';

@Component({
    selector: 'app-week-selector',
    templateUrl: './week-selector.component.html',
    styleUrl: './week-selector.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
            useClass: WeekRangeSelectionStrategy,
        },
        { provide: DateAdapter, useClass: CustomDateAdapter },
        { provide: MAT_DATE_LOCALE, useValue: 'uk' },
    ],
})
export class WeekSelectorComponent implements OnInit {
    protected range = new FormGroup({
        start: new FormControl<Date | null>({ value: null, disabled: true }),
        end: new FormControl<Date | null>({ value: null, disabled: true }),
    });

    constructor(
        private dateService: DateService,
        private dr: DestroyRef
    ) {}

    ngOnInit() {
        this.dateService.weekDays$.pipe(take(1)).subscribe(days => {
            this.range.patchValue({
                start: days[0],
                end: days[6],
            });
        });

        this.range.valueChanges
            .pipe(
                distinctUntilChanged(this.rangeIsEqual.bind(this)),
                takeUntilDestroyed(this.dr)
            )
            .subscribe(value => {
                this.dateService.updateWeekDays(value.start ?? new Date());
            });
    }

    private rangeIsEqual(
        prev: Partial<WeekSelector>,
        current: Partial<WeekSelector>
    ): boolean {
        return (
            prev.start?.getTime() === current.start?.getTime() ||
            prev.end?.getTime() === current.end?.getTime()
        );
    }
}
