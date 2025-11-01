import { RecurrenceFrequency } from '../models/calendar-event.model';

export const RECURRENCE_OPTIONS = [
  { value: RecurrenceFrequency.NONE, label: 'Не повторювати' },
  { value: RecurrenceFrequency.DAILY, label: 'Щоденно' },
  { value: RecurrenceFrequency.WEEKLY, label: 'Щотижня' },
  { value: RecurrenceFrequency.MONTHLY, label: 'Щомісячно' },
];
