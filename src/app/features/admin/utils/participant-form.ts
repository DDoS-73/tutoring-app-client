import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ParticipantDto } from '../../../core/api/participant.api';
import { DEFAULT_PARTICIPANT_PRICE, EventParticipantType, Participant } from '../../../shared/models/participant.model';

export const PARTICIPANT_NAME_MIN_LENGTH = 2;
export const PARTICIPANT_NAME_MAX_LENGTH = 24;

export type ParticipantForm = FormGroup<{
  name: FormControl<string>;
  type: FormControl<EventParticipantType>;
  price: FormControl<number>;
}>;

export function buildParticipantForm(fb: FormBuilder, editData: Participant | null): ParticipantForm {
  return fb.nonNullable.group({
    name: [
      editData?.name || '',
      [
        Validators.required,
        Validators.minLength(PARTICIPANT_NAME_MIN_LENGTH),
        Validators.maxLength(PARTICIPANT_NAME_MAX_LENGTH),
      ],
    ],
    type: [editData?.type ?? EventParticipantType.Student, [Validators.required]],
    price: [editData?.price ?? DEFAULT_PARTICIPANT_PRICE, [Validators.required, Validators.min(0)]],
  });
}

export function toParticipantDto(form: ParticipantForm): ParticipantDto {
  return form.getRawValue();
}
