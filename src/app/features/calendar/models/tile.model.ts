import { CalendarEvent } from './calendar-event.model';

export interface Tile {
    startTime: Date;
    endTime: Date;
    events: CalendarEvent[];
}
