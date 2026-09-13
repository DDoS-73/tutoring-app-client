import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { User } from 'src/app/shared/models/user.model';
import { apiUrl } from '../api/api-url';
import { ApiEndpoints } from '../api/endpoints';
import { TokenStorage } from './token-storage.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly _http = inject(HttpClient);
  private readonly _tokenStorage = inject(TokenStorage);

  private readonly _currentUser = signal<User | null>(null);
  public readonly currentUser = this._currentUser.asReadonly();

  private _isLoaded = false;

  public loadCurrentUser(): Observable<User | null> {
    if (this._isLoaded) {
      return of(this._currentUser());
    }

    if (!this._tokenStorage.hasAnyToken()) {
      this._currentUser.set(null);
      return of(null);
    }

    return this._http.get<User>(apiUrl(ApiEndpoints.User.me)).pipe(
      tap((user) => {
        this._currentUser.set(user);
        this._isLoaded = true;
      }),
      catchError(() => {
        this._currentUser.set(null);
        return of(null);
      })
    );
  }

  public clearUser(): void {
    this._currentUser.set(null);
    this._isLoaded = false;
  }
}
