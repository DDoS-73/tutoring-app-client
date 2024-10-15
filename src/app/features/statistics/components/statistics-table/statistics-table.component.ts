import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
    selector: 'app-statistics-table',
    templateUrl: './statistics-table.component.html',
    styleUrl: './statistics-table.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatisticsTableComponent {
    @Input() labels: string[] = [];
    @Input() paidData: number[] = [];
    @Input() unpaidData: number[] = [];
    @Input() hoursData: number[] = [];
    @Input() unpaidAmount: number = 0;

    get paidDataSum(): number {
        return this.paidData.reduce((acc, el) => acc + el);
    }

    get avgPaidData(): number {
        return +(this.paidDataSum / this.paidData.length).toFixed(2);
    }

    get unpaidDataSum(): number {
        return this.unpaidData.reduce((acc, el) => acc + el);
    }

    get hoursDataSum(): number {
        return this.hoursData.reduce((acc, el) => acc + el);
    }
}
