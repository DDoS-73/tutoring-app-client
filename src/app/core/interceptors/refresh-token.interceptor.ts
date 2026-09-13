import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { ApiEndpoints } from '../api/endpoints';
import { AuthService } from '../services/auth.service';
import { TokenStorage } from '../services/token-storage.service';

function isAuthEndpoint(url: string): boolean {
  return Object.values(ApiEndpoints.Auth).some((endpoint) => url.includes(endpoint));
}

export function refreshTokenInterceptor(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const authService = inject(AuthService);
  const tokenStorage = inject(TokenStorage);

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !isAuthEndpoint(request.url)) {
        return handle401Error(request, next, authService, tokenStorage);
      }
      return throwError(() => error);
    })
  );
}

function handle401Error(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService,
  tokenStorage: TokenStorage
): Observable<HttpEvent<unknown>> {
  return authService.refreshToken().pipe(
    switchMap(() => {
      const token = tokenStorage.getAccessToken();
      const clonedRequest = request.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
      return token ? next(clonedRequest) : next(request);
    }),
    catchError((refreshError) => {
      authService.logout();
      return throwError(() => refreshError);
    })
  );
}
