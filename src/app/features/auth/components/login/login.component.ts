import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AuthService } from '../../../../core/services/auth.service';
import { markAllTouched } from '../../../../shared/utils';
import { PasswordFieldComponent } from '../../../../shared/components/password-field/password-field.component';
import { AuthLayoutComponent } from '../auth-layout/auth-layout.component';

interface LoginFormControls {
  email: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NzIconModule, AuthLayoutComponent, PasswordFieldComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly _authService = inject(AuthService);

  protected isLoading = signal(false);

  protected loginForm = new FormGroup<LoginFormControls>({
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(5)] }),
  });

  protected onSubmit(): void {
    if (this.loginForm.invalid) {
      markAllTouched(this.loginForm);
      return;
    }

    this.isLoading.set(true);
    this._authService.login(this.loginForm.getRawValue()).subscribe({
      error: () => this.isLoading.set(false),
      complete: () => this.isLoading.set(false),
    });
  }
}
