import { AdminPages, MainPages } from '../../shared/models/pages';

export class AdminPaths {
  public static readonly participants = `/${MainPages.Admin}/${AdminPages.Participants}`;

  public static participant(id: string | number): string {
    return `${AdminPaths.participants}/${id}`;
  }
}
