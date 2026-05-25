import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, inject } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { CalendarConfig } from '../../../features/calendar/models/calendar.config';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrl: './time-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgxMaterialTimepickerModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimePickerComponent),
      multi: true,
    },
  ],
})
export class TimePickerComponent implements ControlValueAccessor {
  private readonly cdr = inject(ChangeDetectorRef);

  protected readonly CalendarConfig = CalendarConfig;

  protected value: string = '';
  private dateValue: Date | null = null;
  private onChange = (value: Date | null) => {};
  onTouched = () => {};
  protected disabled = false;

  writeValue(value: Date | null): void {
    this.dateValue = value;
    this.value = value ? this._formatTimeFromDate(value) : '';
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: Date | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onTimeChange(time: string): void {
    this.value = time;
  }

  onTimeSet(time: string): void {
    this.value = time;
    this._updateDateValue(time);
  }

  private _formatTimeFromDate(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  private _updateDateValue(timeString: string): void {
    if (!timeString) {
      this.dateValue = null;
      this.onChange(null);
      return;
    }

    const [hours, minutes] = timeString
      .split(':')
      .map(num => parseInt(num, 10));

    if (isNaN(hours) || isNaN(minutes)) {
      return;
    }

    const newDate = this.dateValue ? new Date(this.dateValue) : new Date();
    newDate.setHours(hours, minutes, 0, 0);

    this.dateValue = newDate;
    this.onChange(newDate);
  }
}
