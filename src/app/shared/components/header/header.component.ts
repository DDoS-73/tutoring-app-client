import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  month = 'Серпень';
  actualMonthEarnings = 500;
  predictedMonthEarnings = 1000;

  weekDate = '14 - 20 Серпня';
  actualWeekEarnings = 100;
  predictedWeekEarnings = 200;
}
