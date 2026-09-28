import { isSignal, Signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';
import { of, startWith, switchMap } from 'rxjs';

export class FormUtils {
  public static markAllTouched(form: FormGroup): void {
    Object.values(form.controls).forEach((control) => {
      control.markAsTouched();
      control.updateValueAndValidity();
    });
  }

  public static events(control: AbstractControl | Signal<AbstractControl>): Signal<unknown> {
    const control$ = isSignal(control) ? toObservable(control) : of(control);
    return toSignal(control$.pipe(switchMap((c) => c.events.pipe(startWith(null)))));
  }

  public static isErrorVisible(control: AbstractControl): boolean {
    return control.invalid && (control.dirty || control.touched);
  }

  public static firstErrorMessage(
    errors: ValidationErrors | null | undefined,
    messages: Record<string, string>
  ): string | null {
    if (!errors) return null;
    if (typeof errors['server'] === 'string') return errors['server'];
    const key = Object.keys(errors).find((k) => k in messages);
    return key ? messages[key] : null;
  }
}
