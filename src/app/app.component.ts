import { Component } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { GoogleAuthService } from './core/services/google-auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    title = 'Tutoring-app';

    constructor(
        private authService: AuthService,
        protected googleAuthService: GoogleAuthService
    ) {
        if (localStorage.getItem('token'))
            this.authService.getProfile().subscribe();
        this.googleAuthService.getProfile().subscribe();
    }
}
