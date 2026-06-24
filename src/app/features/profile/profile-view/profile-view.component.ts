import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProfileService } from '../../../core/services/profile.service';
import { AuthService } from '../../../core/services/auth.service';
import { Profile } from '../../../shared/models/profile.model';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { TranslationService } from '../../../core/i18n/translation.service';

@Component({
  selector: 'app-profile-view',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe],
  templateUrl: './profile-view.component.html',
  styleUrl: './profile-view.component.css'
})
export class ProfileViewComponent implements OnInit, OnDestroy {
  private profileSvc = inject(ProfileService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private i18n = inject(TranslationService);
  private destroy$ = new Subject<void>();

  profile: Profile | null = null;
  loading = true;
  hasProfile = false;
  errorMessage = '';

  ngOnInit(): void {
    // GET /profiles/me — bearer token identifies the user
    this.profileSvc.getMyProfile()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (p) => {
          this.profile = this.normalize(p);
          this.hasProfile = true;
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          if (err?.status === 404) {
            // User has no profile yet — show the "create profile" CTA
            this.hasProfile = false;
            this.profile = null;
            this.errorMessage = '';
          } else {
            // Any other error (0 = network, 401, 500, etc.)
            this.hasProfile = false;
            this.profile = null;
            this.errorMessage = err?.displayMessage
              || (err?.status === 0 ? 'Could not reach the server. Check your connection.' : 'Could not load profile.');
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  delete(): void {
    if (!this.profile) return;
    if (!confirm(this.i18n.t('pv.confirmDel'))) return;
    // DELETE /profiles/me
    this.profileSvc.deleteMyProfile()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.profile = null;
          this.hasProfile = false;
        },
        error: (err) => (this.errorMessage = err?.displayMessage || 'Delete failed')
      });
  }

  get initials(): string {
    const user = this.auth.getCurrentUser();
    if (!user) return '?';
    return `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase();
  }

  /** Translation keys for only the habits the user actually selected. */
  get habits(): string[] {
    const p = this.profile as any;
    if (!p) return [];
    const out: string[] = [];
    if (p.earlyRiser) out.push('rmd.early');
    if (p.clean ?? p.cleanliness) out.push('rmd.clean');
    if (p.studiesAtHome ?? p.studyAtHome) out.push('rmd.studies');
    if (p.smoker) out.push('rmd.smoker');
    if (p.petFriendly) out.push('rmd.pet');
    return out;
  }

  /** Normalize backend field names to legacy aliases used by the template */
  private normalize(p: Profile): Profile {
    return {
      ...p,
      // Map backend field names to legacy aliases the template expects
      budgetMin: p.budgetMin ?? p.minBudget,
      budgetMax: p.budgetMax ?? p.maxBudget,
      housingType: p.housingType ?? (p.accommodationType as any),
      cleanliness: p.cleanliness ?? p.clean,
      studyAtHome: p.studyAtHome ?? p.studiesAtHome,
      movingDate: p.movingDate ?? p.moveInDate,
      // "Looking" status reflects whether the user opted into recommendations
      isLooking: p.isLooking ?? p.visibleInRecommendations ?? p.publicProfile,
      // Ensure required field is always present
      city: p.city ?? ''
    };
  }
}
