import { ChangeEventMode } from '../../const/change-event-mode';
import { CalendarEvent } from '../calendar-event.model';

export interface UpdateEventRequest {
  calendarEvent: CalendarEvent;
  mode: ChangeEventMode;
  date: Date;
}
