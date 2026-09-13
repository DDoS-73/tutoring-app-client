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
        children: [
          {
            path: ':id',
            loadComponent: () =>
              import('./components/participants/participant-detail/participant-detail.component').then(
                (c) => c.ParticipantDetailComponent
              ),
            children: [
              { path: '', redirectTo: 'general', pathMatch: 'full' },
              {
                path: 'general',
                loadComponent: () =>
                  import('./components/participants/participant-general/participant-general.component').then(
                    (c) => c.ParticipantGeneralComponent
                  ),
              },
              {
                path: 'payments',
                loadComponent: () =>
                  import('./components/participants/participant-payments/participant-payments.component').then(
                    (c) => c.ParticipantPaymentsComponent
                  ),
              },
            ],
          },
        ],
      },
    ],
  },
];
