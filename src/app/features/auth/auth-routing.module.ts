import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthPages } from '../../shared/models/pages';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';

const routes: Routes = [
    {
        path: AuthPages.SignIn,
        component: SignInComponent,
    },
    {
        path: AuthPages.SignUp,
        component: SignUpComponent,
    },
    {
        path: '',
        redirectTo: AuthPages.SignIn,
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AuthRoutingModule {}
