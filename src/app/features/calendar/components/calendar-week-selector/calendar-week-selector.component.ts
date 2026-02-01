import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, HostListener, inject, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzDatePickerComponent, NzDatePickerModule } from 'ng-zorro-antd/date-picker';
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
  private readonly elementRef = inject(ElementRef);

  protected weekDays: Signal<Date[]> = this.dateService.currentWeekDays;
  protected selectedDate: Date = new Date();

  protected isPickerOpen = false;

  protected togglePicker(picker: NzDatePickerComponent) {
    if (this.isPickerOpen) {
      picker.close();
      this.isPickerOpen = false;
    } else {
      picker.open();
      this.isPickerOpen = true;
    }
  }

  protected onDateSelect(date: Date) {
    this.dateService.updateAllWeeksDays(date);
    this.isPickerOpen = false;
  }

  protected isInSelectedWeek(date: Date): boolean {
    return date >= this.weekDays()[0] && date <= this.weekDays()[6];
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: Event) {
    if (!this.isPickerOpen) {
      return;
    }
    const target = event.target as HTMLElement;
    const clickedInside = this.elementRef.nativeElement.contains(target);
    const clickedInDropdown = target.closest('.ant-picker-dropdown');

    if (!clickedInside && !clickedInDropdown) {
      this.isPickerOpen = false;
    }
  }
}
