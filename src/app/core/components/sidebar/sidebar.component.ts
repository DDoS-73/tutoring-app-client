import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { GoogleAuthService } from '../../services/google-auth.service';
import { MainPages } from '../../../shared/models/pages';

interface MenuItem {
    title: string;
    icon: string;
    routerLink: string;
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
            routerLink: MainPages.Calendar,
        },
        {
            title: 'Статистика',
            icon: 'query_stats',
            routerLink: MainPages.Statistics,
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
