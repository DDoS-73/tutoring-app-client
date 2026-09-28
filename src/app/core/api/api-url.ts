import { environment } from '../../../environments/environment';

export class ApiUrl {
  public static of(path: string): string {
    return `${environment.backendApi}${path}`;
  }
}
