import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { NOT_PROVIDED } from '../../../../../shared/models/basic-field.model';
import { CUSTOM_FIELD_LOAD_ERROR } from '../../../../../shared/models/custom-field-messages';
import { ParticipantRow } from '../../../../../shared/models/participant-row.model';
import { CustomFieldOwner } from '../../../models/custom-field-modal.model';
import { CustomFieldCommandsService } from '../../../services/custom-field-commands.service';
import { CustomFieldService } from '../../../services/custom-field.service';

@Component({
  selector: 'app-participant-custom-fields',
  templateUrl: './participant-custom-fields.component.html',
  styleUrl: './participant-custom-fields.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParticipantCustomFieldsComponent {
  private readonly customFieldService = inject(CustomFieldService);
  private readonly commands = inject(CustomFieldCommandsService);

  public readonly participant = input.required<ParticipantRow>();

  protected readonly notProvided = NOT_PROVIDED;
  protected readonly loadError = CUSTOM_FIELD_LOAD_ERROR;
  protected readonly owner = computed(() => CustomFieldOwner.of(this.participant()));
  protected readonly query = this.customFieldService.createValuesQuery(computed(() => this.owner()?.id ?? null));

  protected openAddField(): void {
    const owner = this.owner();
    if (owner) this.commands.add(owner);
  }
}
