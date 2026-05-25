import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageKeys } from '../../shared/models/storage.keys';
import { ApiEndpoints } from '../api/endpoints';

function isAuthEndpoint(url: string): boolean {
  return Object.values(ApiEndpoints.Auth).some(
    (endpoint) => endpoint !== ApiEndpoints.Auth.refresh && url.includes(endpoint)
  );
}

export function authInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  if (isAuthEndpoint(request.url)) {
    return next(request);
  }

  let token = localStorage.getItem(StorageKeys.AccessToken);

  if (request.url.includes(ApiEndpoints.Auth.refresh)) {
    token = localStorage.getItem(StorageKeys.RefreshToken);
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
