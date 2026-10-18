import { AbstractControl, ValidatorFn, Validators } from '@angular/forms';
import { TEXT_MAX_LENGTH } from '../models/basic-field.model';
import { CUSTOM_NUMBER_MAX_DIGITS, CustomFieldType } from '../models/custom-field.model';
import { DateUtils } from '../utils/date.utils';
import { BasicFieldValidators } from './basic-field.validators';

export class CustomFieldValidators {
  public static optionKey(label: string | null | undefined): string {
    return (label ?? '').trim().toUpperCase();
  }

  public static readonly optionLabel: ValidatorFn = (control: AbstractControl<string | null>) =>
    control.value?.trim() ? null : { optionLabelRequired: true };

  public static readonly uniqueOptions: ValidatorFn = (array: AbstractControl<{ label: string }[]>) => {
    const keys = array.value.map((option) => CustomFieldValidators.optionKey(option.label)).filter(Boolean);
    return new Set(keys).size === keys.length ? null : { duplicateOption: true };
  };

  public static readonly date: ValidatorFn = (control: AbstractControl<string | null>) => {
    const error = control.value ? DateUtils.displayDateError(control.value) : null;
    return error ? { [error]: true } : null;
  };

  public static readonly optionsRequired: ValidatorFn = (array: AbstractControl<{ label: string }[]>) =>
    array.value.some((option) => option.label?.trim()) ? null : { optionsRequired: true };

  private static readonly BY_TYPE: Record<CustomFieldType, ValidatorFn[]> = {
    [CustomFieldType.Text]: [Validators.maxLength(TEXT_MAX_LENGTH)],
    [CustomFieldType.Number]: [Validators.pattern(new RegExp(`^\\d{1,${CUSTOM_NUMBER_MAX_DIGITS}}$`))],
    [CustomFieldType.Contact]: [BasicFieldValidators.phone],
    [CustomFieldType.Date]: [CustomFieldValidators.date],
    [CustomFieldType.Select]: [],
  };

  public static forType(type: CustomFieldType): ValidatorFn[] {
    return CustomFieldValidators.BY_TYPE[type];
  }
}
