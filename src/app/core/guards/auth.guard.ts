import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthPages, MainPages } from '../../shared/models/pages';
import { ApiEndpoints } from '../api/endpoints';

export const authGuard: CanMatchFn = () => {
  const http = inject(HttpClient);
  const router = inject(Router);

  return http.get(`${environment.backendApi}${ApiEndpoints.User.me}`, { withCredentials: true }).pipe(
    map(() => true),
    catchError(() => {
      router.navigate([MainPages.Auth, AuthPages.Login]);
      return of(false);
    })
  );
};
