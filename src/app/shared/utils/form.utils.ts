import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { isSignal, Signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';
import { of, startWith, switchMap } from 'rxjs';
import { ValidationProblemDetails } from '../../core/models/problem-details.model';

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

  private static validationErrors(error: unknown): Record<string, string[]> | null {
    if (!(error instanceof HttpErrorResponse) || error.status !== HttpStatusCode.BadRequest) return null;
    return (error.error as ValidationProblemDetails | null)?.errors ?? null;
  }

  public static applyServerErrors(error: unknown, targets: Record<string, AbstractControl | undefined>): void {
    const errors = FormUtils.validationErrors(error);
    if (!errors) return;
    Object.entries(errors).forEach(([key, messages]) => {
      const control = targets[key];
      if (!control || !messages?.length) return;
      control.setErrors({ server: messages[0] });
      control.markAsTouched();
    });
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
