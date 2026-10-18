import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { InputFormatDirective } from '../../../../../shared/directives/input-format.directive';
import { CUSTOM_FIELD_DEFINITION_ERRORS, CUSTOM_FIELD_HINTS } from '../../../../../shared/models/custom-field-messages';
import {
  CUSTOM_FIELD_TYPE_LABELS,
  CUSTOM_FIELD_TYPES,
  CUSTOM_NAME_COUNTER_FROM,
  CUSTOM_NAME_MAX_LENGTH,
  CustomFieldType,
} from '../../../../../shared/models/custom-field.model';
import { FormUtils, ModalUtils } from '../../../../../shared/utils';
import { CustomFieldForm } from '../../../forms/custom-field.form';
import { CustomFieldModalData } from '../../../models/custom-field-modal.model';
import { CustomFieldService } from '../../../services/custom-field.service';
import { CustomFieldOptionsComponent } from './custom-field-options/custom-field-options.component';

@Component({
  selector: 'app-custom-field-modal',
  templateUrl: './custom-field-modal.component.html',
  styleUrl: './custom-field-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, NzIconModule, InputFormatDirective, CustomFieldOptionsComponent],
})
export class CustomFieldModalComponent {
  private readonly modalRef = inject<NzModalRef<CustomFieldModalComponent, boolean>>(NzModalRef);
  private readonly customFieldService = inject(CustomFieldService);

  private readonly data = inject<CustomFieldModalData>(NZ_MODAL_DATA);
  protected readonly form = new CustomFieldForm(this.data.field ?? null);
  private readonly formChanges = FormUtils.events(this.form);

  protected readonly types = CUSTOM_FIELD_TYPES;
  protected readonly typeLabels = CUSTOM_FIELD_TYPE_LABELS;
  protected readonly maxLength = CUSTOM_NAME_MAX_LENGTH;
  protected readonly counterFrom = CUSTOM_NAME_COUNTER_FROM;
  protected readonly hints = CUSTOM_FIELD_HINTS;

  protected readonly isPending = signal(false);

  protected readonly isInvalid = computed(() => {
    this.formChanges();
    return this.form.invalid;
  });

  protected readonly nameInvalid = computed(() => {
    this.formChanges();
    return FormUtils.isErrorVisible(this.form.controls.name);
  });

  protected readonly nameError = computed(() => {
    this.formChanges();
    const name = this.form.controls.name;
    return FormUtils.isErrorVisible(name)
      ? FormUtils.firstErrorMessage(name.errors, CUSTOM_FIELD_DEFINITION_ERRORS)
      : null;
  });

  protected readonly nameLength = computed(() => {
    this.formChanges();
    return this.form.controls.name.value.length;
  });

  protected readonly forAllHint = computed(() => {
    this.formChanges();
    return this.form.controls.forAll.value
      ? 'The field is added to every individual student. Values stay separate.'
      : `The field is added to ${this.data.owner.name} only.`;
  });

  constructor() {
    ModalUtils.blockCloseWhile(this.modalRef, this.isPending);
  }

  protected isActiveType(type: CustomFieldType): boolean {
    return this.form.controls.type.value === type;
  }

  protected onClose(): void {
    if (this.isPending()) return;
    this.modalRef.close();
  }

  protected async onSave(): Promise<void> {
    if (this.isPending()) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isPending.set(true);
    try {
      await this.persist();
      this.modalRef.close(true);
    } catch (error) {
      this.isPending.set(false);
      this.form.applyServerErrors(error);
    }
  }

  private persist(): Promise<unknown> {
    const field = this.data.field;
    return field
      ? this.customFieldService.updateMutation.mutateAsync({ id: field.id, dto: this.form.toUpdateDto() })
      : this.customFieldService.createMutation.mutateAsync(this.form.toCreateDto(this.data.owner.id));
  }
}
