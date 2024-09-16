import { Injectable } from '@angular/core';
import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) {}
    public intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        const token = this.authService.getToken();
        if (token) {
            const authReq = this._addHeaders(req, token);
            return next.handle(authReq);
        } else {
            return next.handle(req);
        }
    }

    private _addHeaders(httpRequest: HttpRequest<any>, accessToken?: string) {
        const headers = httpRequest.headers.set(
            'Authorization',
            `Bearer ${accessToken}`
        );

        return httpRequest.clone({ headers });
    }
}
