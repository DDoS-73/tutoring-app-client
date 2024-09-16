import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPages } from './shared/models/pages';
import { LayoutComponent } from './core/components/layout/layout.component';
import { authGuard } from './core/guards/auth.guard';

const routes: Routes = [
    {
        path: MainPages.Auth,
        loadChildren: () =>
            import('./features/auth/auth.module').then(m => m.AuthModule),
    },
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
        canActivate: [authGuard],
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
