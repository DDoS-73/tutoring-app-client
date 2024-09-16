import { inject, Injectable } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { AuthService } from './auth.service';
import { User } from '../../shared/models/auth/user.model';
import { from, Observable, of, switchMap, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class GoogleAuthService {
    protected oAuthService: OAuthService = inject(OAuthService);
    constructor(private authService: AuthService) {
        this._initConfiguration();
    }

    private _initConfiguration() {
        const authConfig: AuthConfig = {
            issuer: 'https://accounts.google.com',
            strictDiscoveryDocumentValidation: false,
            clientId:
                '591037864965-69nblpqhm8latf77brcjd03a495frn7l.apps.googleusercontent.com',
            redirectUri: window.location.origin + '/calendar',
            scope: 'openid profile email',
            showDebugInformation: true,
        };

        this.oAuthService.configure(authConfig);
        this.oAuthService.setupAutomaticSilentRefresh();
    }

    private _loadOAuthData(): Observable<boolean> {
        return from(this.oAuthService.loadDiscoveryDocumentAndTryLogin());
    }

    public signIn() {
        this.oAuthService.initLoginFlow();
    }

    public logout() {
        this.oAuthService.revokeTokenAndLogout();
        this.oAuthService.logOut();
    }

    public getProfile(): Observable<any> {
        return this._loadOAuthData().pipe(
            switchMap(() => {
                const user = this.oAuthService.getIdentityClaims();
                return of(user);
            }),
            tap(user => this.authService.setUser(user as User))
        );
    }

    public hasValidToken() {
        return this.oAuthService.hasValidAccessToken();
    }
}
