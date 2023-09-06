import { Component } from '@angular/core';
import { DateService } from '../../services/date.service';

@Component({
  selector: 'app-calendar-header',
  templateUrl: './calendar-header.component.html',
  styleUrls: ['./calendar-header.component.scss'],
})
export class CalendarHeaderComponent {
  daysOfTheWeek: readonly string[] = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'нд'];
  constructor(public dateService: DateService) {}
}
