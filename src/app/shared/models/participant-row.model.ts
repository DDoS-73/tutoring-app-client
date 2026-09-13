import { DEFAULT_PARTICIPANT_PRICE, EventParticipantType, Participant } from './participant.model';
import { toInitials, getAvatarColor } from '../utils';

export interface ParticipantRow extends Participant {
  initials: string;
  avatarColor: string;
}

export function toParticipantRows(data: Participant[]): ParticipantRow[] {
  return data.map((p) => ({
    ...p,
    initials: toInitials(p.name),
    avatarColor: getAvatarColor(p.name),
    isArchived: p.isArchived ?? false,
  }));
}

export function filterByName<T extends { name: string }>(rows: T[], rawQuery: string): T[] {
  const query = rawQuery.toLowerCase().trim();
  if (!query) return rows;
  return rows.filter((r) => r.name.toLowerCase().includes(query));
}

export function isStudent(row: Participant): boolean {
  return row.type === EventParticipantType.Student || row.type === undefined || row.type === null;
}

export function isGroup(row: Participant): boolean {
  return row.type === EventParticipantType.Group;
}

export function resolvePrice(row: Participant): number {
  return row.price ?? DEFAULT_PARTICIPANT_PRICE;
}
