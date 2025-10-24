import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  Signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  NzDatePickerComponent,
  NzDatePickerModule,
} from 'ng-zorro-antd/date-picker';
import { DateService } from '../../services/date.service';

@Component({
  selector: 'app-calendar-week-selector',
  templateUrl: './calendar-week-selector.component.html',
  styleUrl: './calendar-week-selector.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NzDatePickerModule, FormsModule, DatePipe],
})
export class CalendarWeekSelectorComponent {
  private readonly dateService = inject(DateService);

  protected weekDays: Signal<Date[]> = this.dateService.weekDays;
  protected selectedDate: Date = new Date();

  protected onDateSelect(date: Date) {
    this.dateService.updateWeekDays(date);
  }

  protected isInSelectedWeek(date: Date): boolean {
    return date >= this.weekDays()[0] && date <= this.weekDays()[6];
  }
}
