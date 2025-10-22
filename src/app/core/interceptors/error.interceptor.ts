import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Observable, catchError, throwError } from 'rxjs';

export function ErrorInterceptor(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const notificationService = inject(NzNotificationService);

  return next(request).pipe(
    catchError(({ error }: HttpErrorResponse) => {
      notificationService.error('', error.message);
      return throwError(() => error);
    })
  );
}
