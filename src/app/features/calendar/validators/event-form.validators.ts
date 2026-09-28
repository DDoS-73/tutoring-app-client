import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class EventFormValidators {
  public static readonly timeRange: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const startTime = control.get('startTime')?.value;
    const endTime = control.get('endTime')?.value;

    if (!startTime || !endTime) {
      return null;
    }

    return new Date(startTime) >= new Date(endTime) ? { invalidTimeRange: true } : null;
  };
}
