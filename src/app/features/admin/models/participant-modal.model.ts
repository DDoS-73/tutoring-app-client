import { ParticipantDto } from '../../../core/api/participant.api';

export type ParticipantModalResult = undefined | true | { action: 'delete' } | { updated: ParticipantDto };

export class ParticipantModalResults {
  public static isDeleteRequested(result: ParticipantModalResult): boolean {
    return typeof result === 'object' && result !== null && 'action' in result && result.action === 'delete';
  }
}
