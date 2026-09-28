import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { InputFormatDirective } from '../../../../../../shared/directives/input-format.directive';
import { BASIC_FIELD_ERRORS, BASIC_FIELD_HINTS } from '../../../../../../shared/models/basic-field-messages';
import {
  BASIC_FIELD_LABELS,
  BasicFieldKey,
  DISPLAY_DATE_FORMAT,
  PHONE_MAX_DIGITS,
  TEXT_MAX_LENGTH,
} from '../../../../../../shared/models/basic-field.model';
import { FormUtils } from '../../../../../../shared/utils';
import { BasicFieldValidators } from '../../../../../../shared/validators/basic-field.validators';
import { AdditionalInfoForm, ParentContactForm } from '../../../../forms/additional-info.form';
import { BasicFieldBlockComponent } from './basic-field-block/basic-field-block.component';
import { HideToggleComponent } from './hide-toggle/hide-toggle.component';

type ParentContactPart = 'name' | 'phone';

@Component({
  selector: 'app-additional-info-form',
  templateUrl: './additional-info-form.component.html',
  styleUrl: './additional-info-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    NzDatePickerModule,
    InputFormatDirective,
    BasicFieldBlockComponent,
    HideToggleComponent,
  ],
})
export class AdditionalInfoFormComponent {
  public readonly group = input.required<AdditionalInfoForm>();
  public readonly isPending = input.required<boolean>();

  private readonly groupChanges = FormUtils.events(this.group);

  protected readonly BasicFieldKey = BasicFieldKey;
  protected readonly labels = BASIC_FIELD_LABELS;
  protected readonly dateFormat = DISPLAY_DATE_FORMAT;
  protected readonly isOutsideBirthDateRange = BasicFieldValidators.isOutsideBirthDateRange;
  protected readonly phoneMaxDigits = PHONE_MAX_DIGITS;
  protected readonly textMaxLength = TEXT_MAX_LENGTH;
  protected readonly hints = BASIC_FIELD_HINTS;

  protected readonly hidden = computed(() => {
    this.groupChanges();
    return this.group().hiddenKeys;
  });

  protected readonly errors = computed(() => {
    this.groupChanges();
    const { dateOfBirth, contact, parentContact } = this.group().controls;
    return {
      dateOfBirth: this.errorOf(dateOfBirth),
      contact: this.errorOf(contact),
      parentName: this.parentErrorOf(parentContact, 'name'),
      parentPhone: this.parentErrorOf(parentContact, 'phone'),
    };
  });

  protected readonly hasParentContact = computed(() => {
    this.groupChanges();
    return this.group().controls.parentContact.hasValue;
  });

  protected toggleHidden(key: BasicFieldKey): void {
    this.group().toggleHidden(key);
  }

  private errorOf(control: AbstractControl): string | null {
    return FormUtils.isErrorVisible(control) ? FormUtils.firstErrorMessage(control.errors, BASIC_FIELD_ERRORS) : null;
  }

  private parentErrorOf(parent: ParentContactForm, part: ParentContactPart): string | null {
    if (!FormUtils.isErrorVisible(parent)) return null;
    const requiredKey = `${part}Required`;
    return (
      FormUtils.firstErrorMessage(parent.controls[part].errors, BASIC_FIELD_ERRORS) ??
      (parent.hasError(requiredKey) ? BASIC_FIELD_ERRORS[requiredKey] : null)
    );
  }
}
