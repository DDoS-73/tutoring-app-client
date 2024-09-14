import {
    ChangeDetectionStrategy,
    Component,
    HostListener,
    Input,
    OnInit,
} from '@angular/core';
import { Event } from '../../models/Event.model';
import { MatDialog } from '@angular/material/dialog';
import { CustomMatDialogConfig } from '../../../shared/const/CustomMatDialogConfig';
import { EventInfoDialogComponent } from '../event-info-dialog/event-info-dialog.component';
import { DISPLAYED_HOURS } from '../../../shared/const/hoursAmount';

@Component({
    selector: 'app-event-tile',
    templateUrl: './event-tile.component.html',
    styleUrls: ['./event-tile.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventTileComponent implements OnInit {
    @Input({ required: true }) tileHeight!: number;
    @Input({ required: true }) event!: Event;

    styles: Record<string, string | number> = {};
    weekDay = 0;

    constructor(private dialog: MatDialog) {}

    ngOnInit() {
        this.event.date = new Date(this.event.date);
        this.weekDay =
            this.event.date.getDay() === 0 ? 6 : this.event.date.getDay() - 1;
        const topOffset =
            this.timeToNumber(this.event.startTime) - DISPLAYED_HOURS;
        const height =
            (this.timeToNumber(this.event.finishTime) -
                this.timeToNumber(this.event.startTime)) *
            this.tileHeight;
        this.styles = {
            height: height + 'px',
            top: this.tileHeight * topOffset + topOffset + 'px',
            '--weekday': this.weekDay,
            backgroundColor: this.event.isPaid ? '#18a200' : '#5b2470bd',
        };
    }

    @HostListener('click')
    openDialog() {
        const dialogConfig = new CustomMatDialogConfig<Event>();
        dialogConfig.data = this.event;
        this.dialog.open(EventInfoDialogComponent, dialogConfig);
    }

    private timeToNumber(timeStr: string): number {
        const [hoursStr, minutesStr] = timeStr.split(':');
        const hours = parseInt(hoursStr, 10);
        const minutes = parseInt(minutesStr, 10);
        return hours + minutes / 60;
    }
}
