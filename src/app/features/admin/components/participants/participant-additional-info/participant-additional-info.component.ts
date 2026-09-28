import { DatePipe, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { PhonePipe } from '../../../../../shared/pipes/phone.pipe';
import {
  BASIC_FIELD_LABELS,
  BASIC_FIELD_ORDER,
  BasicFieldKey,
  DISPLAY_DATE_FORMAT,
  NOT_PROVIDED,
} from '../../../../../shared/models/basic-field.model';
import { Participant } from '../../../../../shared/models/participant.model';

@Component({
  selector: 'app-participant-additional-info',
  templateUrl: './participant-additional-info.component.html',
  styleUrl: './participant-additional-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, NgTemplateOutlet, PhonePipe],
})
export class ParticipantAdditionalInfoComponent {
  public readonly participant = input.required<Participant>();

  protected readonly BasicFieldKey = BasicFieldKey;
  protected readonly labels = BASIC_FIELD_LABELS;
  protected readonly dateFormat = DISPLAY_DATE_FORMAT;
  protected readonly notProvided = NOT_PROVIDED;

  protected readonly visibleFields = computed(() => {
    const hidden = this.participant().hiddenBasicFields ?? [];
    return BASIC_FIELD_ORDER.filter((key) => !hidden.includes(key));
  });
}
