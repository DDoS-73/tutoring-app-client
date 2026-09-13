import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiEndpoints } from '../api/endpoints';
import { TokenStorage } from '../services/token-storage.service';

// login and signup don't need a token; logout and refresh are handled separately below
const TOKEN_FREE_ENDPOINTS = [ApiEndpoints.Auth.login, ApiEndpoints.Auth.signup] as const;

function isTokenFreeEndpoint(url: string): boolean {
  return TOKEN_FREE_ENDPOINTS.some((endpoint) => url.includes(endpoint));
}

export function authInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  if (isTokenFreeEndpoint(request.url)) {
    return next(request);
  }

  const tokenStorage = inject(TokenStorage);
  let token = tokenStorage.getAccessToken();

  if (request.url.includes(ApiEndpoints.Auth.refresh)) {
    token = tokenStorage.getRefreshToken();
  }

  if (!token) {
    return next(request);
  }

  const authRequest = request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(authRequest);
}
