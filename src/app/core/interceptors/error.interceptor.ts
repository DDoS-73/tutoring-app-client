import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Observable, catchError, throwError } from 'rxjs';
import { ApiEndpoints } from '../api/endpoints';

export function ErrorInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const notificationService = inject(NzNotificationService);

  return next(request).pipe(
    catchError(({ error, status }: HttpErrorResponse) => {
      if (status === 401 && request.url.includes(ApiEndpoints.Auth.refresh)) {
        return throwError(() => error);
      }
      notificationService.error('', error.message);
      return throwError(() => error);
    })
  );
}
