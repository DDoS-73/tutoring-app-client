import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SignUpRequest } from '../../shared/models/auth/sign-up.request';
import { Observable, ReplaySubject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SignInRequest } from '../../shared/models/auth/sign-in.request';
import { SignInResponse } from '../../shared/models/auth/sign-in.response';
import { User } from '../../shared/models/auth/user.model';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private _user$ = new ReplaySubject<User | null>(1);
    public user$ = this._user$.asObservable();

    constructor(private http: HttpClient) {}

    public signUp(data: SignUpRequest): Observable<never> {
        return this.http.post<never>(
            `${environment.backendApi}/users/register`,
            data
        );
    }

    public signIn(data: SignInRequest): Observable<SignInResponse> {
        return this.http
            .post<SignInResponse>(`${environment.backendApi}/users/login`, data)
            .pipe(tap(({ token }) => localStorage.setItem('token', token)));
    }

    public logout(): void {
        localStorage.removeItem('token');
        this._user$.next(null);
    }

    public getProfile(): Observable<User> {
        return this.http
            .get<User>(`${environment.backendApi}/users/ownProfile`)
            .pipe(tap(user => this.setUser(user)));
    }

    public getToken(): string | null {
        return localStorage.getItem('token');
    }

    public setUser(user: User | null) {
        this._user$.next(user);
    }
}
