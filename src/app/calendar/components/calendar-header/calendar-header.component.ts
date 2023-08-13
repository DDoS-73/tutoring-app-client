import { Component } from '@angular/core';

@Component({
  selector: 'app-calendar-header',
  templateUrl: './calendar-header.component.html',
  styleUrls: ['./calendar-header.component.scss']
})
export class CalendarHeaderComponent {
  daysOfTheWeek: readonly string[] = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'нд'];
  datesOfTheWeek = [13, 14, 15, 16, 17, 18, 19];
}
