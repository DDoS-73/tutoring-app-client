export enum EventParticipantType {
  Student = 0,
  Group = 1,
}

export interface Participant {
  id?: string | number;
  name: string;
  type?: EventParticipantType;
  price?: number;
  isArchived?: boolean;
}
