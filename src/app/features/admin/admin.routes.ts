import { Routes } from '@angular/router';
import { AdminComponent } from './admin.component';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: '', redirectTo: 'participants', pathMatch: 'full' },
      {
        path: 'participants',
        loadComponent: () =>
          import('./components/participants/participants.component').then((c) => c.ParticipantsComponent),
      },
    ],
  },
];
