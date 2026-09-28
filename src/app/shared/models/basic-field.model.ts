export enum BasicFieldKey {
  DateOfBirth = 0,
  Contact = 1,
  ParentContact = 2,
}

export interface ParentContact {
  name: string;
  phone: string;
}

export const BASIC_FIELD_ORDER: readonly BasicFieldKey[] = [
  BasicFieldKey.DateOfBirth,
  BasicFieldKey.Contact,
  BasicFieldKey.ParentContact,
];

export const BASIC_FIELD_LABELS: Record<BasicFieldKey, string> = {
  [BasicFieldKey.DateOfBirth]: 'Date of Birth',
  [BasicFieldKey.Contact]: 'Contact',
  [BasicFieldKey.ParentContact]: 'Parent Contact',
};

export const NOT_PROVIDED = 'Not provided';

export const DISPLAY_DATE_FORMAT = 'dd.MM.yyyy';
export const ISO_DATE_FORMAT = 'yyyy-MM-dd';

export const TEXT_MAX_LENGTH = 50;
export const PHONE_MAX_DIGITS = 12;
