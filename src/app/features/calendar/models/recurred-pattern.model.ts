export enum RecurrenceTypes {
    Daily = 'daily',
    Weekly = 'weekly',
    Monthly = 'monthly',
}
export interface RecurredPattern {
    recurrenceType: RecurrenceTypes;
}
