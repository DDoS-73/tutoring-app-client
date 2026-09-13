import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Observable, catchError, throwError } from 'rxjs';
import { ApiEndpoints } from '../api/endpoints';
import { parseProblemDetails } from '../api/problem-details.parser';

function shouldSuppress(request: HttpRequest<unknown>, errorResponse: HttpErrorResponse): boolean {
  const isFailedAuthUrl =
    errorResponse.url?.includes(ApiEndpoints.Auth.refresh) || errorResponse.url?.includes(ApiEndpoints.Auth.logout);
  const isQuietEndpoint =
    request.url.includes(ApiEndpoints.Auth.refresh) || request.url.includes(ApiEndpoints.Auth.logout);
  const isSilent401 =
    errorResponse.status === 401 &&
    !request.url.includes(ApiEndpoints.Auth.login) &&
    !request.url.includes(ApiEndpoints.Auth.signup);

  // Quiet failure for refresh/logout calls or general 401s on protected endpoints
  return !!isFailedAuthUrl || isQuietEndpoint || isSilent401;
}

export function ErrorInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const notificationService = inject(NzNotificationService);

  return next(request).pipe(
    catchError((errorResponse: HttpErrorResponse) => {
      if (shouldSuppress(request, errorResponse)) {
        return throwError(() => errorResponse);
      }

      const { title, message } = parseProblemDetails(errorResponse);

      notificationService.error(title, message, {
        nzStyle: { whiteSpace: 'pre-line' },
      });

      return throwError(() => errorResponse);
    })
  );
}
