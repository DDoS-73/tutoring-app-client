import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { InputFormatDirective } from '../../../../../../../shared/directives/input-format.directive';
import { PHONE_MAX_DIGITS, TEXT_MAX_LENGTH } from '../../../../../../../shared/models/basic-field.model';
import { CUSTOM_FIELD_ERRORS, CUSTOM_FIELD_HINTS } from '../../../../../../../shared/models/custom-field-messages';
import {
  CUSTOM_NUMBER_COUNTER_FROM,
  CUSTOM_NUMBER_MAX_DIGITS,
  CUSTOM_TEXT_COUNTER_FROM,
  CustomField,
  CustomFieldType,
  DATE_INPUT_LENGTH,
} from '../../../../../../../shared/models/custom-field.model';
import { FormUtils } from '../../../../../../../shared/utils';
import { CustomInputConfig } from '../../../../../models/custom-input-config.model';

@Component({
  selector: 'app-custom-field-input',
  templateUrl: './custom-field-input.component.html',
  styleUrl: './custom-field-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, NzSelectModule, InputFormatDirective],
})
export class CustomFieldInputComponent {
  private static readonly TEXT_CONFIG: CustomInputConfig = {
    format: 'capitalize',
    inputMode: 'text',
    placeholder: '',
    maxLength: TEXT_MAX_LENGTH,
    maxDigits: Number.MAX_SAFE_INTEGER,
    counter: { from: CUSTOM_TEXT_COUNTER_FROM, max: TEXT_MAX_LENGTH },
  };

  private static readonly CONFIGS: Record<CustomFieldType, CustomInputConfig> = {
    [CustomFieldType.Text]: CustomFieldInputComponent.TEXT_CONFIG,
    [CustomFieldType.Select]: CustomFieldInputComponent.TEXT_CONFIG,
    [CustomFieldType.Number]: {
      format: 'digits',
      inputMode: 'numeric',
      placeholder: '0',
      maxLength: null,
      maxDigits: CUSTOM_NUMBER_MAX_DIGITS,
      counter: { from: CUSTOM_NUMBER_COUNTER_FROM, max: CUSTOM_NUMBER_MAX_DIGITS },
    },
    [CustomFieldType.Contact]: {
      format: 'digits',
      inputMode: 'numeric',
      placeholder: '380XXXXXXXXX',
      maxLength: null,
      maxDigits: PHONE_MAX_DIGITS,
      prefix: '+',
      emptyHint: CUSTOM_FIELD_HINTS.phone,
    },
    [CustomFieldType.Date]: {
      format: 'date',
      inputMode: 'numeric',
      placeholder: 'DD.MM.YYYY',
      maxLength: DATE_INPUT_LENGTH,
      maxDigits: Number.MAX_SAFE_INTEGER,
      emptyHint: CUSTOM_FIELD_HINTS.date,
    },
  };

  public readonly field = input.required<CustomField>();
  public readonly control = input.required<FormControl<string | null>>();
  public readonly isPending = input(false);

  private readonly events = FormUtils.events(this.control);

  protected readonly inputId = computed(() => this.field().inputId);
  protected readonly hintId = computed(() => `${this.inputId()}-hint`);
  protected readonly config = computed(() => CustomFieldInputComponent.CONFIGS[this.field().type]);

  protected readonly error = computed(() => {
    this.events();
    const control = this.control();
    return FormUtils.isErrorVisible(control) ? FormUtils.firstErrorMessage(control.errors, CUSTOM_FIELD_ERRORS) : null;
  });

  private readonly length = computed(() => {
    this.events();
    return (this.control().value ?? '').length;
  });

  protected readonly hint = computed(() => {
    const error = this.error();
    if (error) return error;
    const { counter, emptyHint } = this.config();
    const length = this.length();
    if (counter && length >= counter.from) return `${length}/${counter.max}`;
    return length ? null : (emptyHint ?? null);
  });
}
