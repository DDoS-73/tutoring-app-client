import { FormGroup } from '@angular/forms';

export function markAllTouched(form: FormGroup): void {
  Object.values(form.controls).forEach((control) => {
    control.markAsTouched();
    control.updateValueAndValidity();
  });
}
