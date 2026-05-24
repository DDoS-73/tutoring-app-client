import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NzDatePickerComponent, NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { AuthService } from '../../../../core/services/auth.service';
import { MainPages } from '../../../../shared/models/pages';
import { DateService } from '../../services/date.service';

@Component({
  selector: 'app-calendar-header',
  templateUrl: './calendar-header.component.html',
  styleUrl: './calendar-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NzDatePickerModule, NzIconModule, NzDropDownModule, NzMenuModule, FormsModule, DatePipe],
})
export class CalendarHeaderComponent {
  private readonly dateService = inject(DateService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected weekDays: Signal<Date[]> = this.dateService.currentWeekDays;
  protected selectedDate: Date = new Date();
  protected isPickerOpen = false;
  private _pickerWasOpenOnPointerdown = false;

  protected goToPreviousWeek() {
    const start = new Date(this.weekDays()[0]);
    start.setDate(start.getDate() - 7);
    this.dateService.updateAllWeeksDays(start);
  }

  protected goToNextWeek() {
    const start = new Date(this.weekDays()[0]);
    start.setDate(start.getDate() + 7);
    this.dateService.updateAllWeeksDays(start);
  }

  protected goToToday() {
    const now = new Date();
    this.selectedDate = now;
    this.dateService.updateAllWeeksDays(now);
  }

  protected onPillPointerdown() {
    this._pickerWasOpenOnPointerdown = this.isPickerOpen;
  }

  protected togglePicker(picker: NzDatePickerComponent) {
    if (this._pickerWasOpenOnPointerdown) {
      picker.close();
    } else {
      picker.open();
    }
  }

  protected onPickerOpenChange(open: boolean) {
    this.isPickerOpen = open;
  }

  protected onDateSelect(date: Date) {
    this.dateService.updateAllWeeksDays(date);
  }

  protected isInSelectedWeek(date: Date): boolean {
    return date >= this.weekDays()[0] && date <= this.weekDays()[6];
  }

  protected onAdminPanel(): void {
    this.router.navigate([MainPages.Admin]);
  }

  protected onSignOut(): void {
    this.authService.logout();
  }
}
