import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageKeys } from 'src/app/shared/models/storage.keys';
import { ApiEndpoints } from '../api/endpoints';

function isAuthEndpoint(url: string): boolean {
  return Object.values(ApiEndpoints.Auth).some((endpoint) => url.includes(endpoint));
}

export function authInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  if (isAuthEndpoint(request.url)) {
    return next(request);
  }

  const accessToken = localStorage.getItem(StorageKeys.AccessToken);

  if (!accessToken) {
    return next(request);
  }

  const authRequest = request.clone({
    setHeaders: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return next(authRequest);
}
