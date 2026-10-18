import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ParticipantDto } from '../../../core/api/participant.api';
import { DEFAULT_PARTICIPANT_PRICE, EventParticipantType, Participant } from '../../../shared/models/participant.model';
import { FormUtils } from '../../../shared/utils';
import { AdditionalInfoForm } from './additional-info.form';
import { CustomFieldValuesForm } from './custom-field-values.form';

export class ParticipantForm extends FormGroup<{
  name: FormControl<string>;
  type: FormControl<EventParticipantType>;
  price: FormControl<number>;
  additionalInfo: AdditionalInfoForm;
  customValues: CustomFieldValuesForm;
}> {
  public static readonly NAME_MIN_LENGTH = 2;
  public static readonly NAME_MAX_LENGTH = 24;

  constructor(participant: Participant | null) {
    super({
      name: new FormControl(participant?.name || '', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(ParticipantForm.NAME_MIN_LENGTH),
          Validators.maxLength(ParticipantForm.NAME_MAX_LENGTH),
        ],
      }),
      type: new FormControl(participant?.type ?? EventParticipantType.Student, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      price: new FormControl(participant?.price ?? DEFAULT_PARTICIPANT_PRICE, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(0)],
      }),
      additionalInfo: new AdditionalInfoForm(participant),
      customValues: new CustomFieldValuesForm({}),
    });
    this.syncStudentSectionsState();
  }

  public get isStudent(): boolean {
    return this.controls.type.value === EventParticipantType.Student;
  }

  public setType(type: EventParticipantType): void {
    this.controls.type.setValue(type);
    this.syncStudentSectionsState();
  }

  public toDto(locale: string): ParticipantDto {
    const { name, type, price } = this.getRawValue();
    const additionalInfo = this.isStudent ? this.controls.additionalInfo.toDto(locale) : AdditionalInfoForm.empty();
    return { name, type, price, ...additionalInfo };
  }

  public applyServerErrors(error: unknown): void {
    FormUtils.applyServerErrors(error, this.serverErrorTargets());
  }

  private syncStudentSectionsState(): void {
    const { additionalInfo, customValues } = this.controls;
    if (this.isStudent) {
      additionalInfo.enable();
      customValues.enable();
    } else {
      additionalInfo.disable();
      customValues.disable();
    }
  }

  private serverErrorTargets(): Record<string, AbstractControl> {
    const info = this.controls.additionalInfo.controls;
    return {
      DateOfBirth: info.dateOfBirth,
      Contact: info.contact,
      'ParentContact.Name': info.parentContact.controls.name,
      'ParentContact.Phone': info.parentContact.controls.phone,
    };
  }
}
