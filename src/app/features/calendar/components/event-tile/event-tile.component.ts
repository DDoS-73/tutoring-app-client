import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnInit,
} from '@angular/core';
import { CalendarEvent } from '../../models/calendarEvent.model';

@Component({
    selector: 'app-event-tile',
    templateUrl: './event-tile.component.html',
    styleUrls: ['./event-tile.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventTileComponent implements OnInit {
    @Input({ required: true }) height!: number;
    @Input({ required: true }) width!: number;
    @Input({ required: true }) event!: CalendarEvent;

    protected styles: Record<string, string | number> = {};
    protected weekDay = 0;

    ngOnInit() {
        this.event.date = new Date(this.event.date);
        this.weekDay =
            this.event.date.getDay() === 0 ? 6 : this.event.date.getDay() - 1;
        const topOffset = this.timeToNumber(this.event.startTime);
        const height =
            (this.timeToNumber(this.event.finishTime) -
                this.timeToNumber(this.event.startTime)) *
            this.height;
        this.styles = {
            height: height + 'px',
            width: this.width + 'px',
            top: this.height * topOffset + topOffset + 'px',
            left: this.width * this.weekDay + 'px',
            backgroundColor: this.event.isPaid ? '#388e3c' : '#5b2470bd',
        };
    }

    private timeToNumber(timeStr: string): number {
        const [hoursStr, minutesStr] = timeStr.split(':');
        const hours = parseInt(hoursStr, 10);
        const minutes = parseInt(minutesStr, 10);
        return hours + minutes / 60;
    }
}
