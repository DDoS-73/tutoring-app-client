import { BasicFieldKey, ParentContact } from './basic-field.model';

export enum EventParticipantType {
  Student = 0,
  Group = 1,
}

export const DEFAULT_PARTICIPANT_PRICE = 400;

export interface Participant {
  id?: string | number;
  name: string;
  type?: EventParticipantType;
  price?: number;
  isArchived?: boolean;
  dateOfBirth?: string | null;
  contact?: string | null;
  parentContact?: ParentContact | null;
  hiddenBasicFields?: BasicFieldKey[];
}
