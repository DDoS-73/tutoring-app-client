import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Observable, catchError, throwError } from 'rxjs';
import { ApiEndpoints } from '../api/endpoints';

export interface ProblemDetails {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  [key: string]: any; // Allow for custom extension members
}

export interface ValidationProblemDetails extends ProblemDetails {
  errors?: {
    [key: string]: string[];
  };
}

export function ErrorInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const notificationService = inject(NzNotificationService);

  return next(request).pipe(
    catchError((errorResponse: HttpErrorResponse) => {
      const isFailedAuthUrl =
        errorResponse.url?.includes(ApiEndpoints.Auth.refresh) || errorResponse.url?.includes(ApiEndpoints.Auth.logout);
      const isQuietEndpoint =
        request.url.includes(ApiEndpoints.Auth.refresh) || request.url.includes(ApiEndpoints.Auth.logout);
      const isSilent401 =
        errorResponse.status === 401 &&
        !request.url.includes(ApiEndpoints.Auth.login) &&
        !request.url.includes(ApiEndpoints.Auth.signup);

      // Quiet failure for refresh/logout calls or general 401s on protected endpoints
      if (isFailedAuthUrl || isQuietEndpoint || isSilent401) {
        return throwError(() => errorResponse);
      }

      const problem = errorResponse.error as ProblemDetails | ValidationProblemDetails | null;
      let errorTitle = 'Помилка';
      let errorMessage = 'Виникла неочікувана помилка';

      if (problem && typeof problem === 'object') {
        // Parse RFC 7807 standard properties
        if (problem.title) {
          errorTitle = problem.title;
        }
        if (problem.detail) {
          errorMessage = problem.detail;
        } else if (problem['message']) {
          errorMessage = problem['message'];
        }

        // Parse RFC 7807 validation errors dictionary (handles any casing of properties/fields)
        const validationProblem = problem as ValidationProblemDetails;
        if (validationProblem.errors && typeof validationProblem.errors === 'object') {
          const validationList = Object.entries(validationProblem.errors).map(([field, messages]) => {
            const msgList = Array.isArray(messages) ? messages.join(', ') : String(messages);
            return `${field}: ${msgList}`;
          });

          if (validationList.length > 0) {
            errorMessage = validationList.join('\n');
          }
        }
      } else if (typeof problem === 'string') {
        errorMessage = problem;
      } else if (errorResponse.message) {
        errorMessage = errorResponse.message;
      }

      notificationService.error(errorTitle, errorMessage, {
        nzStyle: { whiteSpace: 'pre-line' },
      });

      return throwError(() => errorResponse);
    })
  );
}
