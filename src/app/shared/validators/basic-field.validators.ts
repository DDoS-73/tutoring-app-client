import { AbstractControl, ValidatorFn } from '@angular/forms';
import { ParentContact } from '../models/basic-field.model';
import { DateUtils } from '../utils/date.utils';
import { PhoneUtils } from '../utils/phone.utils';

export class BasicFieldValidators {
  private static readonly MIN_BIRTH_DATE = new Date(1900, 0, 1);

  public static readonly phone: ValidatorFn = (control: AbstractControl<string>) => {
    const value = control.value;
    return !value || PhoneUtils.isValid(value) ? null : { phone: true };
  };

  public static readonly birthDate: ValidatorFn = (control: AbstractControl<Date | null>) => {
    const value = control.value;
    return value && BasicFieldValidators.isOutsideBirthDateRange(value) ? { dateRange: true } : null;
  };

  public static readonly parentContact: ValidatorFn = (group: AbstractControl<ParentContact>) => {
    const hasName = !!group.value.name?.trim();
    const hasPhone = !!group.value.phone;
    if (hasName === hasPhone) return null;
    return hasName ? { phoneRequired: true } : { nameRequired: true };
  };

  public static isOutsideBirthDateRange(date: Date): boolean {
    const day = DateUtils.startOfDay(date);
    return day < BasicFieldValidators.MIN_BIRTH_DATE || day > DateUtils.todayUtc();
  }
}
