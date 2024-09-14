import { ChangeDetectionStrategy, Component, DestroyRef } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { AuthPages, MainPages } from '../../../../shared/models/pages';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';
import { ToasterService } from '../../../../core/services/toaster.service';

@Component({
    selector: 'app-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrl: './sign-in.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInComponent {
    protected loginForm: FormGroup;
    protected readonly signUpLink: string = `/${MainPages.Auth}/${AuthPages.SignUp}`;

    get emailControl(): FormControl {
        return this.loginForm.controls['email'] as FormControl;
    }

    get passwordControl(): FormControl {
        return this.loginForm.controls['password'] as FormControl;
    }

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private dr: DestroyRef,
        private router: Router,
        private toasterService: ToasterService
    ) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
        });
    }

    protected onSubmit() {
        if (this.loginForm.valid) {
            const formValue = this.loginForm.value;
            this.authService
                .signIn(formValue)
                .pipe(takeUntilDestroyed(this.dr))
                .subscribe(() => {
                    this.toasterService.success('Успішний вхід');
                    this.router.navigate(['calendar']);
                });
        }
    }
}
