import { WorkObject } from './work-object.model';
import { RecurredPattern } from './recurred-pattern.model';

export class CalendarEvent {
    id?: string | number;
    workObject: WorkObject;
    price: number;
    date: Date;
    startTime: string;
    finishTime: string;
    repeatable: string;
    isPaid?: boolean;
    recurredPattern: RecurredPattern | null;

    constructor(calendarEvent: CalendarEvent) {
        this.id = calendarEvent.id;
        this.workObject = calendarEvent.workObject;
        this.price = calendarEvent.price;
        this.date = calendarEvent.date;
        this.startTime = calendarEvent.startTime.slice(0, 5);
        this.finishTime = calendarEvent.finishTime.slice(0, 5);
        this.repeatable = calendarEvent.recurredPattern?.recurrenceType ?? '';
        this.isPaid = calendarEvent.isPaid;
        this.recurredPattern = calendarEvent.recurredPattern;
    }
}
