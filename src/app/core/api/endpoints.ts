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
    delete: (id: unknown) => `${this.EVENTS}/${id}`,
    update: (id: unknown) => `${this.EVENTS}/${id}`,
  } as const;

  static readonly Participants = {
    getAll: `${this.PARTICIPANTS}`,
  } as const;
}
