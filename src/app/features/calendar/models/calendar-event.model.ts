import { Participant } from './participant.model';

export class CalendarEvent {
  id?: string | number;
  participant: Participant;
  startTime: Date;
  endTime: Date;
  recurrence: Recurrence;

  // price: number;
  // repeatable: string;
  // isPaid?: boolean;
  // recurredPattern: RecurredPattern | null;

  constructor(calendarEvent: CalendarEvent) {
    this.id = calendarEvent.id;
    this.participant = calendarEvent.participant;
    this.startTime = new Date(calendarEvent.startTime);
    this.endTime = new Date(calendarEvent.endTime);
    this.recurrence = new Recurrence(calendarEvent.recurrence);
    // this.price = calendarEvent.price;
    // this.repeatable = calendarEvent.recurredPattern?.recurrenceType ?? '';
    // this.isPaid = calendarEvent.isPaid;
    // this.recurredPattern = calendarEvent.recurredPattern;
  }
}

export enum RecurrenceFrequency {
  NONE = 'NONE',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
}

export class Recurrence {
  frequency: RecurrenceFrequency;
  interval: number;
  endDate?: string;

  constructor(recurrence: Recurrence) {
    this.frequency = recurrence.frequency;
    this.interval = recurrence.interval;
    this.endDate = recurrence.endDate;
  }
}
