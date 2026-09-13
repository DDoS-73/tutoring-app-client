import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-password-field',
  templateUrl: './password-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, NzIconModule],
})
export class PasswordFieldComponent {
  public readonly form = input.required<FormGroup>();
  public readonly controlName = input('password');
  public readonly minLength = input(5);

  protected readonly isPasswordVisible = signal(false);

  protected get control() {
    return this.form().get(this.controlName());
  }

  protected togglePasswordVisibility(): void {
    this.isPasswordVisible.update((visible) => !visible);
  }
}
