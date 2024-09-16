import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { GoogleAuthService } from '../../services/google-auth.service';

interface MenuItem {
    title: string;
    icon: string;
}

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
    protected readonly menuItems: MenuItem[] = [
        {
            title: 'Календар',
            icon: 'calendar_month',
        },
        {
            title: 'Статистика',
            icon: 'query_stats',
        },
    ];
    protected user$ = this.authService.user$;

    constructor(
        private authService: AuthService,
        private router: Router,
        private googleAuthService: GoogleAuthService
    ) {}

    protected logout() {
        this.authService.logout();
        this.googleAuthService.logout();
        this.router.navigate(['auth/sign-in']);
    }
}
