import { Participant } from '../../../shared/models/participant.model';

export class CalendarEvent {
  id?: string | number;
  participant: Participant;
  startTime: Date;
  endTime: Date;
  recurrence: Recurrence;
  color: string;

  // price: number;
  // isPaid?: boolean;

  constructor(calendarEvent: CalendarEvent) {
    this.id = calendarEvent.id;
    this.participant = calendarEvent.participant;
    this.startTime = new Date(calendarEvent.startTime);
    this.endTime = new Date(calendarEvent.endTime);
    this.recurrence = new Recurrence(calendarEvent.recurrence);
    this.color = calendarEvent.color;
    // this.price = calendarEvent.price;
    // this.isPaid = calendarEvent.isPaid;
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
