import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { AuthService } from './auth.service';
import { User } from '../../shared/models/auth/user.model';
import {
    catchError,
    from,
    Observable,
    of,
    switchMap,
    tap,
    throwError,
} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SignInResponse } from '../../shared/models/auth/sign-in.response';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class GoogleAuthService {
    constructor(
        private authService: AuthService,
        private oAuthService: OAuthService,
        private http: HttpClient
    ) {
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

    public signIn() {
        this.oAuthService.initLoginFlow();
    }

    public logout() {
        this.oAuthService.revokeTokenAndLogout();
        this.oAuthService.logOut();
    }

    public getProfile(): Observable<any> {
        return this._loadOAuthData().pipe(
            switchMap(() => this._getJwtForGoogle()),
            tap(({ token }) => localStorage.setItem('token', token)),
            switchMap(() => {
                const user = this.oAuthService.getIdentityClaims();
                return of(user);
            }),
            tap(data => {
                const user: User = {
                    name: data['given_name'],
                    surname: data['family_name'],
                    email: data['email'],
                };
                this.authService.setUser(user);
            }),
            catchError(err => {
                this.authService.setUser(null);
                return throwError(err);
            })
        );
    }

    private _loadOAuthData(): Observable<boolean> {
        return from(this.oAuthService.loadDiscoveryDocumentAndTryLogin());
    }

    private _getJwtForGoogle() {
        const idToken = this.oAuthService.getIdToken();
        return this.http.post<SignInResponse>(
            `${environment.backendApi}/users/google`,
            { idToken }
        );
    }
}
