import { Component, inject, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProfileService } from '../../../core/services/profile.service';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { TranslationService } from '../../../core/i18n/translation.service';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './profile-edit.component.html',
  styleUrl: './profile-edit.component.css'
})
export class ProfileEditComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private profileSvc = inject(ProfileService);
  private router = inject(Router);
  private i18n = inject(TranslationService);
  private destroy$ = new Subject<void>();

  @Input() id?: string;

  loading = false;
  saving = false;
  errorMessage = '';
  isCreate = false;

  cities = ['Skopje', 'Bitola', 'Tetovo', 'Kumanovo', 'Prilep', 'Ohrid', 'Stip', 'Veles'];
  housingTypes = ['APARTMENT', 'PRIVATE_ROOM', 'STUDIO'];
  lifestyles = ['QUIET', 'SOCIAL', 'BALANCED', 'STUDIOUS'];

  form = this.fb.nonNullable.group({
    city: ['', Validators.required],
    minBudget: [200, [Validators.required, Validators.min(0)]],
    maxBudget: [500, [Validators.required, Validators.min(0)]],
    accommodationType: ['APARTMENT', Validators.required],
    lifestyle: ['BALANCED', Validators.required],
    earlyRiser: [false],
    clean: [true],
    studiesAtHome: [false],
    smoker: [false],
    petFriendly: [false],
    moveInDate: ['', Validators.required],
    bio: ['', [Validators.maxLength(500)]],
    publicProfile: [true],
    visibleInRecommendations: [true]
  });

  ngOnInit(): void {
    this.isCreate = this.id === 'new' || !this.id;

    // Always try to load existing profile (upsert endpoint handles both create and update)
    this.loading = true;
    this.profileSvc.getMyProfile()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (p) => {
          if (p) {
            this.isCreate = false;
            this.form.patchValue({
              city: p.city,
              minBudget: p.minBudget ?? p.budgetMin ?? 200,
              maxBudget: p.maxBudget ?? p.budgetMax ?? 500,
              accommodationType: p.accommodationType ?? (p.housingType as any) ?? 'APARTMENT',
              lifestyle: p.lifestyle ?? 'BALANCED',
              earlyRiser: p.earlyRiser ?? false,
              clean: p.clean ?? p.cleanliness ?? true,
              studiesAtHome: p.studiesAtHome ?? p.studyAtHome ?? false,
              smoker: p.smoker ?? false,
              petFriendly: p.petFriendly ?? false,
              moveInDate: p.moveInDate ?? p.movingDate ?? '',
              bio: p.bio ?? '',
              publicProfile: p.publicProfile ?? true,
              visibleInRecommendations: p.visibleInRecommendations ?? true
            });
          }
          this.loading = false;
        },
        error: (err) => {
          // 404 = no profile yet — stay in create mode
          if (err?.status !== 404) {
            this.errorMessage = err?.displayMessage || 'Could not load profile';
          }
          this.loading = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const data = this.form.getRawValue();
    if (data.minBudget > data.maxBudget) {
      this.errorMessage = this.i18n.t('pe.budgetErr');
      return;
    }

    this.saving = true;
    this.errorMessage = '';

    // PUT /profiles/me — backend uses upsert (create or update)
    // Cast accommodationType and lifestyle to their enum types
    this.profileSvc.upsertProfile(data as any)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
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
