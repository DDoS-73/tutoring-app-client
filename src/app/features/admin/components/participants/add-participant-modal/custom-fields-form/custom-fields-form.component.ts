import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CUSTOM_FIELD_LOAD_ERROR } from '../../../../../../shared/models/custom-field-messages';
import { CustomField } from '../../../../../../shared/models/custom-field.model';
import { CustomFieldValuesForm } from '../../../../forms/custom-field-values.form';
import { CustomFieldOwner } from '../../../../models/custom-field-modal.model';
import { CustomFieldCommandsService } from '../../../../services/custom-field-commands.service';
import { CustomFieldService } from '../../../../services/custom-field.service';
import { CustomFieldInputComponent } from './custom-field-input/custom-field-input.component';

@Component({
  selector: 'app-custom-fields-form',
  templateUrl: './custom-fields-form.component.html',
  styleUrl: './custom-fields-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NzIconModule, CustomFieldInputComponent],
})
export class CustomFieldsFormComponent {
  private readonly customFieldService = inject(CustomFieldService);
  private readonly commands = inject(CustomFieldCommandsService);

  public readonly group = input.required<CustomFieldValuesForm>();
  public readonly owner = input.required<CustomFieldOwner>();
  public readonly isPending = input(false);

  protected readonly query = this.customFieldService.createValuesQuery(computed(() => this.owner().id));

  protected readonly loadError = CUSTOM_FIELD_LOAD_ERROR;

  constructor() {
    effect(() => {
      const data = this.query.data();
      if (data) this.group().sync(data);
    });
  }

  protected onAdd(): void {
    this.commands.add(this.owner());
  }

  protected onEdit(field: CustomField): void {
    this.commands.edit(this.owner(), field);
  }

  protected onDelete(field: CustomField): void {
    this.commands.delete(field);
  }
}
