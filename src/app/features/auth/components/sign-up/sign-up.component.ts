import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AuthService } from '../../../../core/services/auth.service';
import { AuthLayoutComponent } from '../auth-layout/auth-layout.component';

interface SignUpFormControls {
  name: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NzIconModule, AuthLayoutComponent],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUpComponent {
  private readonly _authService = inject(AuthService);

  protected isLoading = signal(false);
  protected isPasswordVisible = signal(false);

  protected signUpForm = new FormGroup<SignUpFormControls>({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(5)] }),
  });

  protected togglePasswordVisibility(): void {
    this.isPasswordVisible.update((visible) => !visible);
  }

  protected onSubmit(): void {
    if (this.signUpForm.invalid) {
      Object.values(this.signUpForm.controls).forEach((control) => {
        control.markAsTouched();
        control.updateValueAndValidity();
      });
      return;
    }

    this.isLoading.set(true);
    // Submit registration to auth service
    this._authService.signup(this.signUpForm.getRawValue()).subscribe({
      error: () => this.isLoading.set(false),
      complete: () => this.isLoading.set(false),
    });
  }
}
