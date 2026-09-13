import { AdminPages, MainPages } from '../../shared/models/pages';

export const ADMIN_PARTICIPANTS_PATH = `/${MainPages.Admin}/${AdminPages.Participants}`;

export function participantPath(id: string | number): string {
  return `${ADMIN_PARTICIPANTS_PATH}/${id}`;
}
