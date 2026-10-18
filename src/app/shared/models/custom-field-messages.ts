import { BASIC_FIELD_ERRORS, BASIC_FIELD_HINTS } from './basic-field-messages';
import { CUSTOM_FIELD_MAX_OPTIONS, CUSTOM_NAME_MAX_LENGTH, CUSTOM_NUMBER_MAX_DIGITS } from './custom-field.model';

export const CUSTOM_FIELD_ERRORS: Record<string, string> = {
  phone: BASIC_FIELD_ERRORS['phone'],
  maxlength: BASIC_FIELD_ERRORS['maxlength'],
  pattern: `Enter up to ${CUSTOM_NUMBER_MAX_DIGITS} digits.`,
  date: 'Use the format DD.MM.YYYY.',
  dateRange: BASIC_FIELD_ERRORS['dateRange'],
  dateInvalid: 'That date does not exist.',
};

export const CUSTOM_FIELD_DEFINITION_ERRORS: Record<string, string> = {
  required: 'Field name is required.',
  maxlength: BASIC_FIELD_ERRORS['maxlength'],
  duplicateName: 'A field with this name already exists.',
  optionsRequired: 'Add at least one option.',
  duplicateOption: 'Option labels must be unique.',
  optionLabelRequired: 'Enter a value or remove this option.',
};

export const CUSTOM_FIELD_LOAD_ERROR = 'Failed to load custom fields. Please try again.';

export const CUSTOM_FIELD_HINTS = {
  date: 'Format DD.MM.YYYY',
  phone: BASIC_FIELD_HINTS.phone,
  maxName: `Maximum ${CUSTOM_NAME_MAX_LENGTH} characters.`,
  maxOptions: `Maximum ${CUSTOM_FIELD_MAX_OPTIONS} options.`,
  options: (count: number) => `${count} of ${CUSTOM_FIELD_MAX_OPTIONS} options · drag to reorder`,
} as const;
