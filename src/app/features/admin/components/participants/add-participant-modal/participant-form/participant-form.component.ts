import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { DEFAULT_PARTICIPANT_PRICE, EventParticipantType } from '../../../../../../shared/models/participant.model';
import { FormUtils } from '../../../../../../shared/utils';
import { ParticipantForm } from '../../../../forms/participant.form';
import { AdditionalInfoFormComponent } from '../additional-info-form/additional-info-form.component';

@Component({
  selector: 'app-participant-form',
  templateUrl: './participant-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, NzIconModule, AdditionalInfoFormComponent],
})
export class ParticipantFormComponent {
  public readonly form = input.required<ParticipantForm>();
  public readonly isPending = input.required<boolean>();
  public readonly save = output<void>();

  private readonly formChanges = FormUtils.events(this.form);

  protected readonly EventParticipantType = EventParticipantType;
  protected readonly nameMinLength = ParticipantForm.NAME_MIN_LENGTH;
  protected readonly nameMaxLength = ParticipantForm.NAME_MAX_LENGTH;
  protected readonly pricePlaceholder = String(DEFAULT_PARTICIPANT_PRICE);

  protected readonly isStudent = computed(() => {
    this.formChanges();
    return this.form().isStudent;
  });

  protected readonly nameError = computed(() => {
    this.formChanges();
    return FormUtils.isErrorVisible(this.form().controls.name);
  });

  protected readonly priceError = computed(() => {
    this.formChanges();
    return FormUtils.isErrorVisible(this.form().controls.price);
  });

  protected setType(type: EventParticipantType): void {
    if (this.isPending()) return;
    this.form().setType(type);
  }

  protected onPriceFocus(event: FocusEvent): void {
    (event.target as HTMLInputElement).select();
  }
}
