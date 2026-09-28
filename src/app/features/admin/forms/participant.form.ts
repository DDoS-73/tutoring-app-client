import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ParticipantDto } from '../../../core/api/participant.api';
import { ValidationProblemDetails } from '../../../core/models/problem-details.model';
import { DEFAULT_PARTICIPANT_PRICE, EventParticipantType, Participant } from '../../../shared/models/participant.model';
import { AdditionalInfoForm } from './additional-info.form';

export class ParticipantForm extends FormGroup<{
  name: FormControl<string>;
  type: FormControl<EventParticipantType>;
  price: FormControl<number>;
  additionalInfo: AdditionalInfoForm;
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
    });
    this.syncAdditionalInfoState();
  }

  public get isStudent(): boolean {
    return this.controls.type.value === EventParticipantType.Student;
  }

  public setType(type: EventParticipantType): void {
    this.controls.type.setValue(type);
    this.syncAdditionalInfoState();
  }

  public toDto(locale: string): ParticipantDto {
    const { name, type, price } = this.getRawValue();
    const additionalInfo = this.isStudent ? this.controls.additionalInfo.toDto(locale) : AdditionalInfoForm.empty();
    return { name, type, price, ...additionalInfo };
  }

  public applyServerErrors(error: unknown): void {
    if (!(error instanceof HttpErrorResponse) || error.status !== HttpStatusCode.BadRequest) return;
    const errors = (error.error as ValidationProblemDetails | null)?.errors;
    if (!errors) return;

    const targets = this.serverErrorTargets();
    Object.entries(errors).forEach(([key, messages]) => {
      const control = targets[key];
      if (!control || !messages?.length) return;
      control.setErrors({ server: messages[0] });
      control.markAsTouched();
    });
  }

  private syncAdditionalInfoState(): void {
    const additionalInfo = this.controls.additionalInfo;
    if (this.isStudent) {
      additionalInfo.enable();
    } else {
      additionalInfo.disable();
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
