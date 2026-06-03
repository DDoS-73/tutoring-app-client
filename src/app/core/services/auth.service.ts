import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, filter, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import { TokensResponse } from '../../features/auth/models';
import { StorageKeys } from '../../shared/models/storage.keys';
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

  public login(credentials: { email: string; password: string }): Observable<TokensResponse> {
    return this._http.post<TokensResponse>(`${environment.backendApi}${ApiEndpoints.Auth.login}`, credentials).pipe(
      tap((tokens) => {
        this._setTokens(tokens);
        this._router.navigate([MainPages.Calendar]);
      })
    );
  }

  public signup(data: { name: string; email: string; password: string }): Observable<TokensResponse> {
    return this._http.post<TokensResponse>(`${environment.backendApi}${ApiEndpoints.Auth.signup}`, data).pipe(
      tap((tokens) => {
        this._setTokens(tokens);
        this._router.navigate([MainPages.Calendar]);
      })
    );
  }

  public refreshToken(): Observable<boolean> {
    if (this._isRefreshing) {
      return this._refreshTokenSubject.pipe(
        filter((result) => result !== null),
        take(1),
        switchMap((success) => (success ? of(true) : throwError(() => new Error('Token refresh failed'))))
      );
    }

    this._isRefreshing = true;
    this._refreshTokenSubject.next(null);

    return this._http.post<TokensResponse>(`${environment.backendApi}${ApiEndpoints.Auth.refresh}`, {}).pipe(
      map((tokens) => {
        this._setTokens(tokens);
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
    this._http.post(`${environment.backendApi}${ApiEndpoints.Auth.logout}`, {}).subscribe({
      complete: () => {
        this._removeTokens();
        this._router.navigate([MainPages.Auth]);
      },
      error: () => {
        this._removeTokens();
        this._router.navigate([MainPages.Auth]);
      },
    });
  }

  private _setTokens(tokens: TokensResponse): void {
    localStorage.setItem(StorageKeys.AccessToken, tokens.accessToken);
    localStorage.setItem(StorageKeys.RefreshToken, tokens.refreshToken);
  }

  private _removeTokens(): void {
    localStorage.removeItem(StorageKeys.AccessToken);
    localStorage.removeItem(StorageKeys.RefreshToken);
  }
}
