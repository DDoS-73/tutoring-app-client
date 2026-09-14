import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { DEFAULT_PARTICIPANT_PRICE, EventParticipantType } from '../../../../../../shared/models/participant.model';
import {
  ParticipantForm,
  PARTICIPANT_NAME_MAX_LENGTH,
  PARTICIPANT_NAME_MIN_LENGTH,
} from '../../../../utils/participant-form';

@Component({
  selector: 'app-participant-form',
  templateUrl: './participant-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, NzIconModule],
})
export class ParticipantFormComponent {
  public readonly form = input.required<ParticipantForm>();
  public readonly isPending = input.required<boolean>();
  public readonly save = output<void>();

  protected readonly EventParticipantType = EventParticipantType;
  protected readonly nameMinLength = PARTICIPANT_NAME_MIN_LENGTH;
  protected readonly nameMaxLength = PARTICIPANT_NAME_MAX_LENGTH;
  protected readonly pricePlaceholder = String(DEFAULT_PARTICIPANT_PRICE);

  protected setType(type: EventParticipantType): void {
    if (this.isPending()) return;
    this.form().patchValue({ type });
  }

  protected onPriceFocus(event: FocusEvent): void {
    (event.target as HTMLInputElement).select();
  }
}
