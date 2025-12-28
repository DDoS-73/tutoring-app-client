import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, filter, map, Observable, take, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MainPages } from '../../shared/models/pages';
import { ApiEndpoints } from '../api/endpoints';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _http = inject(HttpClient);
  private readonly _router = inject(Router);

  private _isRefreshing = false;
  private _refreshTokenSubject = new BehaviorSubject<boolean | null>(null);

  public login(credentials: { email: string; password: string }): Observable<void> {
    return this._http
      .post<void>(`${environment.backendApi}${ApiEndpoints.Auth.login}`, credentials, { withCredentials: true })
      .pipe(tap(() => this._router.navigate([MainPages.Calendar])));
  }

  public refreshToken(): Observable<boolean> {
    if (this._isRefreshing) {
      return this._refreshTokenSubject.pipe(
        filter((result) => result !== null),
        take(1),
        map((result) => result!)
      );
    }

    this._isRefreshing = true;
    this._refreshTokenSubject.next(null);

    return this._http
      .post<void>(`${environment.backendApi}${ApiEndpoints.Auth.refresh}`, {}, { withCredentials: true })
      .pipe(
        map(() => {
          this._isRefreshing = false;
          this._refreshTokenSubject.next(true);
          return true;
        }),
        catchError((error) => {
          this._isRefreshing = false;
          this._refreshTokenSubject.next(false);
          return throwError(() => error);
        })
      );
  }

  public logout(): void {
    this._http.post(`${environment.backendApi}${ApiEndpoints.Auth.logout}`, {}, { withCredentials: true }).subscribe({
      complete: () => this._router.navigate([MainPages.Auth]),
      error: () => this._router.navigate([MainPages.Auth]),
    });
  }
}
