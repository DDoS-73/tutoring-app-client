import { formatDate } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdditionalInfoDto } from '../../../core/api/participant.api';
import {
  BasicFieldKey,
  ISO_DATE_FORMAT,
  ParentContact,
  TEXT_MAX_LENGTH,
} from '../../../shared/models/basic-field.model';
import { Participant } from '../../../shared/models/participant.model';
import { DateUtils } from '../../../shared/utils/date.utils';
import { StringUtils } from '../../../shared/utils/string.utils';
import { BasicFieldValidators } from '../../../shared/validators/basic-field.validators';

export class ParentContactForm extends FormGroup<{
  name: FormControl<string>;
  phone: FormControl<string>;
}> {
  constructor(parentContact: ParentContact | null | undefined) {
    super(
      {
        name: new FormControl(parentContact?.name ?? '', {
          nonNullable: true,
          validators: [Validators.maxLength(TEXT_MAX_LENGTH)],
        }),
        phone: new FormControl(parentContact?.phone ?? '', {
          nonNullable: true,
          validators: [BasicFieldValidators.phone],
        }),
      },
      { validators: BasicFieldValidators.parentContact }
    );
  }

  public get hasValue(): boolean {
    const { name, phone } = this.getRawValue();
    return !!(name || phone);
  }

  public clear(): void {
    this.reset({ name: '', phone: '' });
  }

  public toDto(): ParentContact | null {
    const { name, phone } = this.getRawValue();
    const trimmedName = StringUtils.emptyToNull(name);
    return trimmedName && phone ? { name: trimmedName, phone } : null;
  }
}

export class AdditionalInfoForm extends FormGroup<{
  dateOfBirth: FormControl<Date | null>;
  contact: FormControl<string>;
  parentContact: ParentContactForm;
  hiddenBasicFields: FormControl<BasicFieldKey[]>;
}> {
  constructor(participant: Participant | null) {
    super({
      dateOfBirth: new FormControl<Date | null>(
        participant?.dateOfBirth ? DateUtils.isoDateToLocal(participant.dateOfBirth) : null,
        { validators: [BasicFieldValidators.birthDate] }
      ),
      contact: new FormControl(participant?.contact ?? '', {
        nonNullable: true,
        validators: [BasicFieldValidators.phone],
      }),
      parentContact: new ParentContactForm(participant?.parentContact),
      hiddenBasicFields: new FormControl<BasicFieldKey[]>(participant?.hiddenBasicFields ?? [], { nonNullable: true }),
    });
  }

  public static empty(): AdditionalInfoDto {
    return { dateOfBirth: null, contact: null, parentContact: null, hiddenBasicFields: [] };
  }

  public get hiddenKeys(): ReadonlySet<BasicFieldKey> {
    return new Set(this.controls.hiddenBasicFields.value);
  }

  public toggleHidden(key: BasicFieldKey): void {
    const hiddenControl = this.controls.hiddenBasicFields;
    const hidden = hiddenControl.value;
    if (hidden.includes(key)) {
      hiddenControl.setValue(hidden.filter((k) => k !== key));
    } else {
      this.clearIfInvalid(key);
      hiddenControl.setValue([...hidden, key]);
    }
    hiddenControl.markAsDirty();
  }

  public toDto(locale: string): AdditionalInfoDto {
    const { dateOfBirth, contact, hiddenBasicFields } = this.getRawValue();
    return {
      dateOfBirth: dateOfBirth ? formatDate(dateOfBirth, ISO_DATE_FORMAT, locale) : null,
      contact: StringUtils.emptyToNull(contact),
      parentContact: this.controls.parentContact.toDto(),
      hiddenBasicFields,
    };
  }

  private clearIfInvalid(key: BasicFieldKey): void {
    const { dateOfBirth, contact, parentContact } = this.controls;
    switch (key) {
      case BasicFieldKey.DateOfBirth:
        if (dateOfBirth.invalid) dateOfBirth.reset(null);
        return;
      case BasicFieldKey.Contact:
        if (contact.invalid) contact.reset('');
        return;
      case BasicFieldKey.ParentContact:
        if (parentContact.invalid) parentContact.clear();
        return;
    }
  }
}
