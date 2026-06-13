import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { User } from 'src/app/shared/models/user.model';
import { environment } from '../../../environments/environment';
import { StorageKeys } from '../../shared/models/storage.keys';
import { ApiEndpoints } from '../api/endpoints';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly _http = inject(HttpClient);

  private readonly _currentUser = signal<User | null>(null);
  public readonly currentUser = this._currentUser.asReadonly();

  private _isLoaded = false;

  public loadCurrentUser(): Observable<User | null> {
    if (this._isLoaded) {
      return of(this._currentUser());
    }

    if (!localStorage.getItem(StorageKeys.AccessToken) && !localStorage.getItem(StorageKeys.RefreshToken)) {
      this._currentUser.set(null);
      return of(null);
    }

    return this._http.get<User>(`${environment.backendApi}${ApiEndpoints.User.me}`).pipe(
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

  public setUser(user: User): void {
    this._currentUser.set(user);
    this._isLoaded = true;
  }

  public clearUser(): void {
    this._currentUser.set(null);
    this._isLoaded = false;
  }
}
