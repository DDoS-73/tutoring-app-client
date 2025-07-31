import { Routes } from '@angular/router';
import { MainPages } from './shared/models/pages';
import { LayoutComponent } from './core/components/layout/layout.component';

export const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: MainPages.Calendar, pathMatch: 'full' },
            {
                path: MainPages.Calendar,
                loadChildren: () =>
                    import('./features/calendar/calendar.module').then(
                        m => m.CalendarModule
                    ),
            },
        ],
    },
];
