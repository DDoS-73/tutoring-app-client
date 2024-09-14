import { Injectable } from '@angular/core';
import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) {}
    public intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        const authReq = this._addHeaders(req);
        return next.handle(authReq);
    }

    private _addHeaders(httpRequest: HttpRequest<any>, accessToken?: string) {
        const authToken = accessToken || this.authService.getToken();
        const headers = httpRequest.headers.set(
            'Authorization',
            `Bearer ${authToken}`
        );

        return httpRequest.clone({ headers });
    }
}
