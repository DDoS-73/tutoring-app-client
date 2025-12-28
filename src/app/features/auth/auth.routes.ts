import { Routes } from '@angular/router';
import { AuthPages } from 'src/app/shared/models/pages';
import { LoginComponent } from './components/login/login.component';

export const authRoutes: Routes = [
  { path: '', redirectTo: AuthPages.Login, pathMatch: 'full' },
  {
    path: AuthPages.Login,
    component: LoginComponent,
  },
];
