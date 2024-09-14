import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPages } from './shared/models/pages';

const routes: Routes = [
    {
        path: MainPages.Auth,
        loadChildren: () =>
            import('./features/auth/auth.module').then(m => m.AuthModule),
    },
    {
        path: MainPages.Calendar,
        loadChildren: () =>
            import('./features/calendar/calendar.module').then(
                m => m.CalendarModule
            ),
    },
    { path: '', redirectTo: MainPages.Calendar, pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
