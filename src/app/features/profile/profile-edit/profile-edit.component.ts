import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileService } from '../../../core/services/profile.service';
import { AuthService } from '../../../core/services/auth.service';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { TranslationService } from '../../../core/i18n/translation.service';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './profile-edit.component.html',
  styleUrl: './profile-edit.component.css'
})
export class ProfileEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private profileSvc = inject(ProfileService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private i18n = inject(TranslationService);

  @Input() id?: string;

  loading = false;
  saving = false;
  errorMessage = '';
  isCreate = false;

  cities = ['Skopje', 'Bitola', 'Tetovo', 'Kumanovo', 'Prilep', 'Ohrid', 'Stip', 'Veles'];
  housingTypes = ['APARTMENT', 'HOUSE', 'STUDIO', 'ROOM'];
  lifestyles = ['QUIET', 'SOCIAL', 'BALANCED', 'STUDIOUS'];

  form = this.fb.nonNullable.group({
    city: ['', Validators.required],
    budgetMin: [200, [Validators.required, Validators.min(0)]],
    budgetMax: [500, [Validators.required, Validators.min(0)]],
    housingType: ['APARTMENT', Validators.required],
    lifestyle: ['BALANCED', Validators.required],
    earlyRiser: [false],
    cleanliness: [true],
    studyAtHome: [false],
    movingDate: ['', Validators.required],
    bio: ['', [Validators.maxLength(500)]]
  });

  ngOnInit(): void {
    this.isCreate = this.id === 'new' || !this.id;
    if (this.isCreate) return;

    const user = this.auth.getCurrentUser();
    if (!user) return;

    this.loading = true;
    this.profileSvc.getProfile(user.id).subscribe({
      next: (p) => {
        if (p) {
          this.form.patchValue({
            city: p.city,
            budgetMin: p.budgetMin,
            budgetMax: p.budgetMax,
            housingType: p.housingType,
            lifestyle: p.lifestyle,
            earlyRiser: p.earlyRiser,
            cleanliness: p.cleanliness,
            studyAtHome: p.studyAtHome,
            movingDate: p.movingDate,
            bio: p.bio
          });
        }
        this.loading = false;
      },
      error: () => (this.loading = false)
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const data = this.form.getRawValue();
    if (data.budgetMin > data.budgetMax) {
      this.errorMessage = this.i18n.t('pe.budgetErr');
      return;
    }

    this.saving = true;
    this.errorMessage = '';
    const payload: any = data;

    const obs = this.isCreate
      ? this.profileSvc.createProfile(payload)
      : this.profileSvc.updateProfile(Number(this.id), payload);

    obs.subscribe({
      next: () => {
        this.saving = false;
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        this.saving = false;
        this.errorMessage = err?.displayMessage || 'Save failed';
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/profile']);
  }

  hasError(field: string, error: string): boolean {
    const c = this.form.get(field);
    return !!(c && c.touched && c.hasError(error));
  }
}
