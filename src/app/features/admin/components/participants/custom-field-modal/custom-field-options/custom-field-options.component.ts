import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { TEXT_MAX_LENGTH } from '../../../../../../shared/models/basic-field.model';
import {
  CUSTOM_FIELD_DEFINITION_ERRORS,
  CUSTOM_FIELD_HINTS,
} from '../../../../../../shared/models/custom-field-messages';
import { CUSTOM_FIELD_MAX_OPTIONS } from '../../../../../../shared/models/custom-field.model';
import { FormUtils } from '../../../../../../shared/utils';
import { CustomFieldForm, CustomFieldOptionForm } from '../../../../forms/custom-field.form';

@Component({
  selector: 'app-custom-field-options',
  templateUrl: './custom-field-options.component.html',
  styleUrl: './custom-field-options.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, DragDropModule, NzIconModule],
})
export class CustomFieldOptionsComponent {
  public readonly form = input.required<CustomFieldForm>();
  public readonly isPending = input(false);

  protected readonly maxLength = TEXT_MAX_LENGTH;

  private readonly optionsChanges = FormUtils.events(computed(() => this.form().controls.options));

  protected readonly options = computed(() => {
    this.optionsChanges();
    return [...this.form().controls.options.controls];
  });

  protected readonly isFull = computed(() => this.options().length >= CUSTOM_FIELD_MAX_OPTIONS);

  private readonly error = computed(() => {
    this.optionsChanges();
    const options = this.form().controls.options;
    const arrayError = FormUtils.isErrorVisible(options)
      ? FormUtils.firstErrorMessage(options.errors, CUSTOM_FIELD_DEFINITION_ERRORS)
      : null;
    const row = options.controls.find((o) => FormUtils.isErrorVisible(o.controls.label));
    return (
      arrayError ??
      (row ? FormUtils.firstErrorMessage(row.controls.label.errors, CUSTOM_FIELD_DEFINITION_ERRORS) : null)
    );
  });

  protected readonly hintIsError = computed(() => !!this.error() || this.isFull());

  protected readonly hint = computed(
    () =>
      this.error() ??
      (this.isFull() ? CUSTOM_FIELD_HINTS.maxOptions : CUSTOM_FIELD_HINTS.options(this.options().length))
  );

  protected isRowInvalid(option: CustomFieldOptionForm): boolean {
    const options = this.form().controls.options;
    const duplicate =
      options.hasError('duplicateOption') && FormUtils.isErrorVisible(options) && this.form().isDuplicateOption(option);
    return duplicate || FormUtils.isErrorVisible(option.controls.label);
  }

  protected onDrop(event: CdkDragDrop<unknown>): void {
    this.form().moveOption(event.previousIndex, event.currentIndex);
  }
}
