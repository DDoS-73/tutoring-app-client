import { CustomField } from '../../../shared/models/custom-field.model';
import { ParticipantRow } from '../../../shared/models/participant-row.model';

export class CustomFieldOwner {
  constructor(
    public readonly id: string | number,
    public readonly name: string
  ) {}

  public static of(row: ParticipantRow | null): CustomFieldOwner | null {
    return row?.isStudent && row.id != null ? new CustomFieldOwner(row.id, row.name) : null;
  }
}

export interface CustomFieldModalData {
  owner: CustomFieldOwner;
  field?: CustomField;
}
