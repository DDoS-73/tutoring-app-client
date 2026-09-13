import { Injectable } from '@angular/core';
import { StorageKeys } from '../../shared/models/storage.keys';

@Injectable({ providedIn: 'root' })
export class TokenStorage {
  public getAccessToken(): string | null {
    return localStorage.getItem(StorageKeys.AccessToken);
  }

  public getRefreshToken(): string | null {
    return localStorage.getItem(StorageKeys.RefreshToken);
  }

  public hasAnyToken(): boolean {
    return !!this.getAccessToken() || !!this.getRefreshToken();
  }

  public setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(StorageKeys.AccessToken, accessToken);
    localStorage.setItem(StorageKeys.RefreshToken, refreshToken);
  }

  public removeTokens(): void {
    localStorage.removeItem(StorageKeys.AccessToken);
    localStorage.removeItem(StorageKeys.RefreshToken);
  }
}
