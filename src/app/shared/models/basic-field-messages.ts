import { TEXT_MAX_LENGTH } from './basic-field.model';

export const BASIC_FIELD_ERRORS: Record<string, string> = {
  phone: 'Enter 10 digits, or 12 with a country code.',
  dateRange: 'Enter a valid year.',
  nameRequired: 'Name is required when a parent contact is entered.',
  phoneRequired: 'Phone is required when a parent contact is entered.',
  maxlength: `Maximum ${TEXT_MAX_LENGTH} characters.`,
};

export const BASIC_FIELD_HINTS = {
  phone: '10 digits, or 12 with a country code.',
} as const;
