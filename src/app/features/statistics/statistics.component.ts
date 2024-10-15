import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    DestroyRef,
    OnInit,
} from '@angular/core';
import { StatisticsService } from './services/statistics.service';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import { Moment } from 'moment';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Statistics, WorkObjectStatistics } from './models/statistics.model';
import { PartialChartDataset } from '../../shared/models/chart-dataset.model';

@Component({
    selector: 'app-statistics',
    templateUrl: './statistics.component.html',
    styleUrl: './statistics.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatisticsComponent implements OnInit {
    protected statistics: Statistics | null = null;
    protected isLoading: boolean = false;

    protected date = new FormControl<Moment>(
        {
            value: moment(),
            disabled: true,
        },
        { nonNullable: true }
    );

    get earningsDatasets(): PartialChartDataset[] {
        if (!this.statistics) return [];
        return [
            {
                data: this.statistics.paidData,
                label: 'Оплачені події, грн',
            },
            {
                data: this.statistics.unpaidData,
                label: 'Неоплачені події, грн',
            },
        ];
    }

    get hoursDatasets(): PartialChartDataset[] {
        if (!this.statistics) return [];
        return [
            {
                data: this.statistics.hoursData,
                label: 'Кількість годин',
            },
        ];
    }

    constructor(
        private statisticsService: StatisticsService,
        private cdr: ChangeDetectorRef,
        private dr: DestroyRef
    ) {}

    ngOnInit() {
        this._fetchStatistics(this.date.value.format());

        this.date.valueChanges
            .pipe(takeUntilDestroyed(this.dr))
            .subscribe(value => {
                this._fetchStatistics(value.format());
            });
    }

    protected getWorkObjectsDatasets(
        statistics: WorkObjectStatistics
    ): PartialChartDataset[] {
        if (!this.statistics) return [];
        return [
            {
                data: statistics.data,
            },
        ];
    }

    private _fetchStatistics(date: string) {
        this.isLoading = true;
        this.statisticsService.getMonthStatistics(date).subscribe(data => {
            this.statistics = data;
            this.isLoading = false;

            this.cdr.detectChanges();
        });
    }
}
