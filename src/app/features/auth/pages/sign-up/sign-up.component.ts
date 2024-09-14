import { ChangeDetectionStrategy, Component, DestroyRef } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { AuthPages, MainPages } from '../../../../shared/models/pages';
import { AuthService } from '../../../../shared/services/auth/auth.service';
import { switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrl: './sign-up.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUpComponent {
    protected signUpForm: FormGroup;
    protected readonly signInLink: string = `/${MainPages.Auth}/${AuthPages.SignIn}`;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private dr: DestroyRef,
        private router: Router
    ) {
        this.signUpForm = this.fb.group({
            name: ['', Validators.required],
            surname: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
        });
    }

    get nameControl(): FormControl {
        return this.signUpForm.controls['name'] as FormControl;
    }

    get surnameControl(): FormControl {
        return this.signUpForm.controls['surname'] as FormControl;
    }

    get emailControl(): FormControl {
        return this.signUpForm.controls['email'] as FormControl;
    }

    get passwordControl(): FormControl {
        return this.signUpForm.controls['password'] as FormControl;
    }

    protected onSubmit() {
        if (this.signUpForm.valid) {
            const formValue = this.signUpForm.value;
            this.authService
                .signUp(formValue)
                .pipe(
                    switchMap(() => this.authService.signIn(formValue)),
                    takeUntilDestroyed(this.dr)
                )
                .subscribe(() => this.router.navigate(['calendar']));
        }
    }
}
