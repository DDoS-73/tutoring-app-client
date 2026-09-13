import { Routes } from '@angular/router';
import { AdminPages, ParticipantTabs } from '../../shared/models/pages';
import { AdminComponent } from './admin.component';
import { ParticipantCommandsService } from './services/participant-commands.service';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: '', redirectTo: AdminPages.Participants, pathMatch: 'full' },
      {
        path: AdminPages.Participants,
        providers: [ParticipantCommandsService],
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
              { path: '', redirectTo: ParticipantTabs.General, pathMatch: 'full' },
              {
                path: ParticipantTabs.General,
                loadComponent: () =>
                  import('./components/participants/participant-general/participant-general.component').then(
                    (c) => c.ParticipantGeneralComponent
                  ),
              },
              {
                path: ParticipantTabs.Payments,
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
