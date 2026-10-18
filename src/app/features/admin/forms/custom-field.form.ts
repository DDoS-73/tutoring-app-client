import { moveItemInArray } from '@angular/cdk/drag-drop';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { CreateCustomFieldDto, UpdateCustomFieldDto } from '../../../core/api/custom-field.api';
import { TEXT_MAX_LENGTH } from '../../../shared/models/basic-field.model';
import {
  CUSTOM_FIELD_MAX_OPTIONS,
  CUSTOM_NAME_MAX_LENGTH,
  CustomField,
  CustomFieldOption,
  CustomFieldScope,
  CustomFieldType,
} from '../../../shared/models/custom-field.model';
import { FormUtils, StringUtils } from '../../../shared/utils';
import { CustomFieldValidators } from '../../../shared/validators/custom-field.validators';

export class CustomFieldOptionForm extends FormGroup<{
  id: FormControl<string | null>;
  label: FormControl<string>;
}> {
  constructor(option?: CustomFieldOption) {
    super({
      id: new FormControl<string | null>(option?.id ?? null),
      label: new FormControl(option?.label ?? '', {
        nonNullable: true,
        validators: option?.id
          ? [Validators.maxLength(TEXT_MAX_LENGTH), CustomFieldValidators.optionLabel]
          : [Validators.maxLength(TEXT_MAX_LENGTH)],
      }),
    });
  }
}

export class CustomFieldForm extends FormGroup<{
  name: FormControl<string>;
  type: FormControl<CustomFieldType>;
  options: FormArray<CustomFieldOptionForm>;
  forAll: FormControl<boolean>;
}> {
  public readonly isEdit: boolean;

  constructor(field: CustomField | null) {
    super({
      name: new FormControl(field?.name ?? '', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(CUSTOM_NAME_MAX_LENGTH)],
      }),
      type: new FormControl(field?.type ?? CustomFieldType.Text, { nonNullable: true }),
      options: new FormArray(CustomFieldForm.initialOptions(field), {
        validators: [CustomFieldValidators.optionsRequired, CustomFieldValidators.uniqueOptions],
      }),
      forAll: new FormControl(field?.isForAll ?? false, { nonNullable: true }),
    });
    this.isEdit = !!field;
    if (this.isEdit) {
      this.controls.type.disable();
      this.controls.forAll.disable();
    }
    this.syncOptionsState();
  }

  public get isSelect(): boolean {
    return this.controls.type.value === CustomFieldType.Select;
  }

  public get canAddOption(): boolean {
    return this.controls.options.length < CUSTOM_FIELD_MAX_OPTIONS;
  }

  public setType(type: CustomFieldType): void {
    if (this.isEdit) return;
    this.controls.type.setValue(type);
    this.syncOptionsState();
  }

  public addOption(): void {
    if (!this.canAddOption) return;
    this.controls.options.push(new CustomFieldOptionForm());
  }

  public isDuplicateOption(option: CustomFieldOptionForm): boolean {
    const key = CustomFieldValidators.optionKey(option.controls.label.value);
    return (
      !!key &&
      this.controls.options.controls.filter((o) => CustomFieldValidators.optionKey(o.controls.label.value) === key)
        .length > 1
    );
  }

  public removeOption(index: number): void {
    this.controls.options.removeAt(index);
    this.controls.options.markAsDirty();
  }

  public moveOption(from: number, to: number): void {
    if (from === to) return;
    const options = this.controls.options;
    moveItemInArray(options.controls, from, to);
    options.updateValueAndValidity();
    options.markAsDirty();
  }

  public toCreateDto(participantId: string | number): CreateCustomFieldDto {
    const { forAll } = this.getRawValue();
    return {
      name: this.normalizedName,
      type: this.controls.type.value,
      scope: forAll ? CustomFieldScope.All : CustomFieldScope.Participant,
      participantId: forAll ? null : participantId,
      options: this.isSelect ? this.filledOptions.map((o) => o.label) : [],
    };
  }

  public toUpdateDto(): UpdateCustomFieldDto {
    return {
      name: this.normalizedName,
      options: this.isSelect ? this.filledOptions : [],
    };
  }

  public applyServerErrors(error: unknown): void {
    if (error instanceof HttpErrorResponse && error.status === HttpStatusCode.Conflict) {
      this.controls.name.setErrors({ duplicateName: true });
      this.controls.name.markAsTouched();
      return;
    }
    FormUtils.applyServerErrors(error, { Name: this.controls.name });
  }

  private get normalizedName(): string {
    return StringUtils.capitalizeFirst(this.controls.name.value.trim());
  }

  private get filledOptions(): { id: string | null; label: string }[] {
    return this.controls.options.controls
      .map((option) => option.getRawValue())
      .map((option) => ({ id: option.id, label: option.label.trim() }))
      .filter((option) => option.label);
  }

  private syncOptionsState(): void {
    if (this.isSelect) {
      this.controls.options.enable();
    } else {
      this.controls.options.disable();
    }
  }

  private static initialOptions(field: CustomField | null): CustomFieldOptionForm[] {
    const options = field?.options ?? [];
    return options.length ? options.map((o) => new CustomFieldOptionForm(o)) : [new CustomFieldOptionForm()];
  }
}
