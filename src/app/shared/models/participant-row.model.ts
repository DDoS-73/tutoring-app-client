import { Participant } from './participant.model';
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
