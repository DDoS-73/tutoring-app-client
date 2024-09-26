import { WorkObject } from './work-object.model';

export class CalendarEvent {
    id?: string | number;
    workObject: WorkObject;
    price: number;
    date: Date;
    startTime: string;
    finishTime: string;
    repeatable: boolean;
    isPaid?: boolean;

    constructor(calendarEvent: CalendarEvent) {
        this.id = calendarEvent.id;
        this.workObject = calendarEvent.workObject;
        this.price = calendarEvent.price;
        this.date = calendarEvent.date;
        this.startTime = calendarEvent.startTime.slice(0, 5);
        this.finishTime = calendarEvent.finishTime.slice(0, 5);
        this.repeatable = calendarEvent.repeatable;
        this.isPaid = calendarEvent.isPaid;
    }
}
