import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { authRoutes } from './features/auth/auth.routes';
import { MainPages } from './shared/models/pages';

export const routes: Routes = [
  { path: '', redirectTo: MainPages.Calendar, pathMatch: 'full' },
  {
    path: MainPages.Calendar,
    loadComponent: () => import('./features/calendar/calendar.component').then((c) => c.CalendarComponent),
    canMatch: [authGuard],
  },
  {
    path: MainPages.Admin,
    loadChildren: () => import('./features/admin/admin.routes').then((r) => r.adminRoutes),
    canMatch: [authGuard],
  },
  {
    path: MainPages.Auth,
    loadChildren: () => authRoutes,
  },
];
