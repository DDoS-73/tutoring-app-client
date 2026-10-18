import { DateUtils } from '../utils/date.utils';
import { PhoneUtils } from '../utils/phone.utils';

export enum CustomFieldType {
  Text = 0,
  Contact = 1,
  Number = 2,
  Date = 3,
  Select = 4,
}

export enum CustomFieldScope {
  All = 0,
  Participant = 1,
}

export interface CustomFieldOption {
  id: string;
  label: string;
}

export interface CustomFieldValueRowDto {
  fieldId: string;
  name: string;
  type: CustomFieldType;
  scope: CustomFieldScope;
  options: CustomFieldOption[];
  value: string | null;
}

export const CUSTOM_FIELD_TYPE_LABELS: Record<CustomFieldType, string> = {
  [CustomFieldType.Text]: 'Text',
  [CustomFieldType.Contact]: 'Contact',
  [CustomFieldType.Number]: 'Number',
  [CustomFieldType.Date]: 'Date',
  [CustomFieldType.Select]: 'Select',
};

export const CUSTOM_FIELD_TYPES: readonly CustomFieldType[] = [
  CustomFieldType.Text,
  CustomFieldType.Contact,
  CustomFieldType.Number,
  CustomFieldType.Date,
  CustomFieldType.Select,
].sort((a, b) => CUSTOM_FIELD_TYPE_LABELS[a].localeCompare(CUSTOM_FIELD_TYPE_LABELS[b], 'en'));

export const CUSTOM_FIELD_MAX_OPTIONS = 15;
export const CUSTOM_NUMBER_MAX_DIGITS = 10;
export const CUSTOM_NAME_MAX_LENGTH = 20;
export const CUSTOM_NAME_COUNTER_FROM = 16;
export const CUSTOM_TEXT_COUNTER_FROM = 40;
export const CUSTOM_NUMBER_COUNTER_FROM = 8;
export const DATE_INPUT_LENGTH = 10;

export class CustomField {
  private static readonly CYRILLIC_START = /^[Ѐ-ӿ]/;
  private static readonly UK_COLLATOR = new Intl.Collator('uk', { sensitivity: 'base' });
  private static readonly EN_COLLATOR = new Intl.Collator('en', { sensitivity: 'base' });

  public readonly id: string;
  public readonly name: string;
  public readonly type: CustomFieldType;
  public readonly scope: CustomFieldScope;
  public readonly options: readonly CustomFieldOption[];
  public readonly value: string | null;

  constructor(row: CustomFieldValueRowDto) {
    this.id = row.fieldId;
    this.name = row.name;
    this.type = row.type;
    this.scope = row.scope;
    this.options = row.options ?? [];
    this.value = row.value || null;
  }

  public static fromList(rows: CustomFieldValueRowDto[]): CustomField[] {
    return rows.map((row) => new CustomField(row)).sort(CustomField.compare);
  }

  public get inputId(): string {
    return `custom-${this.id}`;
  }

  public get isSelect(): boolean {
    return this.type === CustomFieldType.Select;
  }

  public get isForAll(): boolean {
    return this.scope === CustomFieldScope.All;
  }

  public get displayValue(): string | null {
    if (!this.value) return null;
    switch (this.type) {
      case CustomFieldType.Select:
        return this.options.find((o) => o.id === this.value)?.label ?? null;
      case CustomFieldType.Date:
        return DateUtils.isoToDisplay(this.value) ?? this.value;
      case CustomFieldType.Contact:
        return PhoneUtils.toDisplay(this.value);
      default:
        return this.value;
    }
  }

  public get deleteConfirmText(): string {
    return this.isForAll
      ? 'This will remove this field and its saved values from all student profiles.'
      : 'This will remove this field and its saved value from this student profile.';
  }

  public toFormValue(): string | null {
    if (!this.value) return null;
    return this.type === CustomFieldType.Date ? (DateUtils.isoToDisplay(this.value) ?? this.value) : this.value;
  }

  public parse(formValue: string | null): string | null {
    const trimmed = formValue?.trim();
    if (!trimmed) return null;
    return this.type === CustomFieldType.Date ? (DateUtils.displayToIso(trimmed) ?? trimmed) : trimmed;
  }

  public hasOption(id: string | null): boolean {
    return this.options.some((o) => o.id === id);
  }

  private static compare(a: CustomField, b: CustomField): number {
    const aCyrillic = CustomField.CYRILLIC_START.test(a.name.trim());
    const bCyrillic = CustomField.CYRILLIC_START.test(b.name.trim());
    if (aCyrillic !== bCyrillic) return aCyrillic ? -1 : 1;
    const collator = aCyrillic ? CustomField.UK_COLLATOR : CustomField.EN_COLLATOR;
    return collator.compare(a.name, b.name);
  }
}
