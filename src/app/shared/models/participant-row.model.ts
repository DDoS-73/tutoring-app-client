import { StringUtils } from '../utils/string.utils';
import { BasicFieldKey, ParentContact } from './basic-field.model';
import { DEFAULT_PARTICIPANT_PRICE, EventParticipantType, Participant } from './participant.model';

export class ParticipantRow implements Participant {
  id?: string | number;
  name: string;
  type?: EventParticipantType;
  price?: number;
  isArchived: boolean;
  dateOfBirth?: string | null;
  contact?: string | null;
  parentContact?: ParentContact | null;
  hiddenBasicFields?: BasicFieldKey[];
  initials: string;
  avatarColor: string;

  constructor(participant: Participant) {
    this.id = participant.id;
    this.name = participant.name;
    this.type = participant.type;
    this.price = participant.price;
    this.isArchived = participant.isArchived ?? false;
    this.dateOfBirth = participant.dateOfBirth;
    this.contact = participant.contact;
    this.parentContact = participant.parentContact;
    this.hiddenBasicFields = participant.hiddenBasicFields;
    this.initials = StringUtils.toInitials(participant.name);
    this.avatarColor = StringUtils.avatarColor(participant.name);
  }

  public get isStudent(): boolean {
    return this.type === EventParticipantType.Student || this.type == null;
  }

  public get isGroup(): boolean {
    return this.type === EventParticipantType.Group;
  }

  public get pricePerClass(): number {
    return this.price ?? DEFAULT_PARTICIPANT_PRICE;
  }

  public static fromList(participants: Participant[]): ParticipantRow[] {
    return participants.map((participant) => new ParticipantRow(participant));
  }

  public static filterByName<T extends { name: string }>(rows: T[], rawQuery: string): T[] {
    const query = rawQuery.toLowerCase().trim();
    if (!query) return rows;
    return rows.filter((r) => r.name.toLowerCase().includes(query));
  }
}
