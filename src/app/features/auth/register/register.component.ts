import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { TranslationService } from '../../../core/i18n/translation.service';

const passwordMatch = (group: AbstractControl): ValidationErrors | null => {
  const pw = group.get('password')?.value;
  const cp = group.get('confirmPassword')?.value;
  return pw && cp && pw !== cp ? { mismatch: true } : null;
};

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslatePipe],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private i18n = inject(TranslationService);

  loading = false;
  errorMessage = '';

  form = this.fb.nonNullable.group(
    {
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    },
    { validators: passwordMatch }
  );

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.errorMessage = '';
    const { firstName, lastName, email, password } = this.form.getRawValue();
    this.auth.register({ firstName, lastName, email, password }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.displayMessage || this.i18n.t('reg.error');
      }
    });
  }

  hasError(field: string, error: string): boolean {
    const c = this.form.get(field);
    return !!(c && c.touched && c.hasError(error));
  }

  get passwordsDoNotMatch(): boolean {
    return !!(this.form.touched && this.form.hasError('mismatch'));
  }
}
