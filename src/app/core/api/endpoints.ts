export class ApiEndpoints {
  private static readonly AUTH = '/auth';
  private static readonly USER = '/user';
  private static readonly EVENTS = '/events';
  private static readonly PARTICIPANTS = '/participants';

  static readonly User = {
    me: `${this.USER}/me`,
  } as const;

  static readonly Auth = {
    refresh: `${this.AUTH}/refresh`,
    login: `${this.AUTH}/login`,
    signup: `${this.AUTH}/signup`,
    logout: `${this.AUTH}/logout`,
  } as const;

  static readonly Events = {
    getAll: `${this.EVENTS}`,
    create: `${this.EVENTS}`,
    delete: (id: string | number) => `${this.EVENTS}/${id}`,
    update: (id: string | number) => `${this.EVENTS}/${id}`,
  } as const;

  static readonly Participants = {
    getAll: `${this.PARTICIPANTS}`,
    create: `${this.PARTICIPANTS}`,
    delete: (id: string | number) => `${this.PARTICIPANTS}/${id}`,
    update: (id: string | number) => `${this.PARTICIPANTS}/${id}`,
    archive: (id: string | number) => `${this.PARTICIPANTS}/${id}/archive`,
    unarchive: (id: string | number) => `${this.PARTICIPANTS}/${id}/unarchive`,
  } as const;
}
