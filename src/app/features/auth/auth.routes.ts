import { Routes } from '@angular/router';
import { AuthPages } from '../../shared/models/pages';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';

export const authRoutes: Routes = [
  { path: '', redirectTo: AuthPages.Login, pathMatch: 'full' },
  {
    path: AuthPages.Login,
    component: LoginComponent,
  },
  {
    path: AuthPages.SignUp,
    component: SignUpComponent,
  },
];
