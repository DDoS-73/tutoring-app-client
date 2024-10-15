import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnInit,
    ViewChild,
} from '@angular/core';
import { ChartConfiguration, ChartDataset, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { PartialChartDataset } from '../../models/chart-dataset.model';

@Component({
    selector: 'app-chart',
    templateUrl: './chart.component.html',
    styleUrl: './chart.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartComponent implements OnInit {
    @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

    @Input() chartType: ChartType = 'line';
    @Input() set datasets(datasets: PartialChartDataset[]) {
        this.lineChartData.datasets = [];
        for (const dataset of datasets) {
            this.lineChartData.datasets.push(this._createChartDataset(dataset));
        }

        this.chart?.update();
    }
    @Input() set labels(labels: string[]) {
        this.lineChartData.labels = labels;
        this.chart?.update();
    }

    protected lineChartData: ChartConfiguration['data'] = {
        datasets: [],
        labels: [],
    };

    protected readonly lineChartOptions: ChartConfiguration['options'] = {
        elements: {
            line: {
                tension: 0.4,
            },
        },
        scales: {
            y: {
                position: 'left',
                min: 0,
            },
        },
        maintainAspectRatio: true,
        responsive: true,
        plugins: {
            legend: { display: true, position: 'top' },
        },
    };

    ngOnInit() {
        switch (this.chartType) {
            case 'pie':
                this.lineChartOptions!.plugins!.legend!.position = 'left';
                this.lineChartOptions!.scales = {};
                break;
        }
    }

    private _createChartDataset(dataset: PartialChartDataset): ChartDataset {
        return {
            data: dataset.data ?? [],
            label: dataset.label ?? 'Статистика',
            pointRadius: 3,
            fill: 'origin',
        };
    }
}
