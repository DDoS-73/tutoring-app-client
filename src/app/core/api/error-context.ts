import { HttpContext, HttpContextToken, HttpRequest, HttpStatusCode } from '@angular/common/http';

export class ErrorContext {
  private static readonly SILENT_STATUSES = new HttpContextToken<readonly number[]>(() => []);

  public static silence(...statuses: HttpStatusCode[]): HttpContext {
    return new HttpContext().set(ErrorContext.SILENT_STATUSES, statuses);
  }

  public static isSilenced(request: HttpRequest<unknown>, status: number): boolean {
    return request.context.get(ErrorContext.SILENT_STATUSES).includes(status);
  }
}
