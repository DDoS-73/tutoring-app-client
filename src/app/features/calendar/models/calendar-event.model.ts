import { Participant } from './participant.model';

export class CalendarEvent {
    id?: string | number;
    participant: Participant;
    startTime: Date;
    endTime: Date;

    // price: number;
    // repeatable: string;
    // isPaid?: boolean;
    // recurredPattern: RecurredPattern | null;

    constructor(calendarEvent: CalendarEvent) {
        this.id = calendarEvent.id;
        this.participant = calendarEvent.participant;
        this.startTime = new Date(calendarEvent.startTime);
        this.endTime = new Date(calendarEvent.endTime);
        // this.price = calendarEvent.price;
        // this.repeatable = calendarEvent.recurredPattern?.recurrenceType ?? '';
        // this.isPaid = calendarEvent.isPaid;
        // this.recurredPattern = calendarEvent.recurredPattern;
    }
}
