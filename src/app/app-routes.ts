import { Routes } from '@angular/router';
import { MainPages } from './shared/models/pages';

export const routes: Routes = [
  { path: '', redirectTo: MainPages.Calendar, pathMatch: 'full' },
  {
    path: MainPages.Calendar,
    loadComponent: () =>
      import('./features/calendar/calendar.component').then(
        c => c.CalendarComponent
      ),
  },
];
