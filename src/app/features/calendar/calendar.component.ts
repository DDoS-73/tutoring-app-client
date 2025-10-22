import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CalendarBodyComponent } from './components/calendar-body/calendar-body.component';
import { DateService } from './services/date.service';
import { EventService } from './services/event.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DateService, EventService],
  imports: [CalendarBodyComponent],
})
export class CalendarComponent {}
