import { signal, untracked } from '@angular/core';
import { FormControl, FormRecord } from '@angular/forms';
import { SaveCustomFieldValuesDto } from '../../../core/api/custom-field.api';
import { CustomField } from '../../../shared/models/custom-field.model';
import { CustomFieldValidators } from '../../../shared/validators/custom-field.validators';

export class CustomFieldValuesForm extends FormRecord<FormControl<string | null>> {
  private readonly fieldsState = signal<CustomField[]>([]);
  public readonly fields = this.fieldsState.asReadonly();

  public sync(fields: CustomField[]): void {
    const previous = new Map(untracked(this.fieldsState).map((field) => [field.id, field]));
    const ids = new Set(fields.map((field) => field.id));

    Object.keys(this.controls)
      .filter((id) => !ids.has(id))
      .forEach((id) => this.removeControl(id, { emitEvent: false }));

    fields.forEach((field) => {
      const control = this.controls[field.id];
      if (!control) {
        this.addControl(field.id, this.createControl(field), { emitEvent: false });
      } else if (CustomFieldValuesForm.shouldReset(control, previous.get(field.id), field)) {
        control.reset(field.toFormValue(), { emitEvent: false });
      }
    });

    this.updateValueAndValidity();
    this.fieldsState.set(fields);
  }

  public toDto(): SaveCustomFieldValuesDto {
    if (this.disabled) return { values: [] };
    const values = this.fieldsState()
      .map((field) => ({ field, value: field.parse(this.controls[field.id]?.value ?? null) }))
      .filter(({ field, value }) => value !== field.value)
      .map(({ field, value }) => ({ fieldId: field.id, value }));
    return { values };
  }

  private createControl(field: CustomField): FormControl<string | null> {
    return new FormControl<string | null>(
      { value: field.toFormValue(), disabled: this.disabled },
      { validators: CustomFieldValidators.forType(field.type) }
    );
  }

  private static shouldReset(
    control: FormControl<string | null>,
    previous: CustomField | undefined,
    next: CustomField
  ): boolean {
    const isUnchanged = !previous || previous.parse(control.value) === previous.value;
    const lostOption = next.isSelect && !!control.value && !next.hasOption(control.value);
    return isUnchanged || lostOption;
  }
}
