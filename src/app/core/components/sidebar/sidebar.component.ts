import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
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
    standalone: false
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

    constructor(
        private router: Router,
    ) {}
}
