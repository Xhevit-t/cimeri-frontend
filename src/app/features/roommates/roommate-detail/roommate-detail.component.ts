import { Component, inject, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProfileService } from '../../../core/services/profile.service';
import { RequestService } from '../../../core/services/request.service';
import { AuthService } from '../../../core/services/auth.service';
import { Profile } from '../../../shared/models/profile.model';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-roommate-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './roommate-detail.component.html',
  styleUrl: './roommate-detail.component.css'
})
export class RoommateDetailComponent implements OnInit, OnDestroy {
  private profileSvc = inject(ProfileService);
  private requests = inject(RequestService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  @Input() id!: string;

  profile: Profile | null = null;
  loading = true;
  errorMessage = '';

  showRequestForm = false;
  message = '';
  sending = false;
  successMessage = '';
  /** Compatibility score — not available from the real backend; kept for template compatibility */
  compatibility: number | undefined = undefined;

  ngOnInit(): void {
    const userId = Number(this.id);
    // GET /profiles/user/{userId}
    this.profileSvc.getProfile(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (p) => {
          this.profile = this.normalize(p);
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err?.displayMessage || 'Could not load profile';
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  sendRequest(): void {
    if (!this.profile || !this.message.trim()) return;
    this.sending = true;
    this.errorMessage = '';
    // POST /contact-requests via RequestService.sendRequest()
    this.requests.sendRequest({
      receiverId: this.profile.userId,
      message: this.message
    }).pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.sending = false;
          this.successMessage = 'Request sent!';
          this.showRequestForm = false;
          this.message = '';
        },
        error: (err) => {
          this.sending = false;
          this.errorMessage = err?.displayMessage || 'Failed to send request';
        }
      });
  }

  back(): void {
    this.router.navigate(['/roommates']);
  }

  get initials(): string {
    if (!this.profile) return '?';
    return `${this.profile.firstName?.charAt(0) || ''}${this.profile.lastName?.charAt(0) || ''}`.toUpperCase();
  }

  get isSelf(): boolean {
    const me = this.auth.getCurrentUser();
    return !!me && !!this.profile && me.id === this.profile.userId;
  }

  /** Translation keys for only the habits this roommate actually selected. */
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

  /** Map backend field names to the legacy aliases the template reads. */
  private normalize(p: Profile): Profile {
    return {
      ...p,
      budgetMin: p.budgetMin ?? p.minBudget,
      budgetMax: p.budgetMax ?? p.maxBudget,
      housingType: p.housingType ?? (p.accommodationType as any),
      cleanliness: p.cleanliness ?? p.clean,
      studyAtHome: p.studyAtHome ?? p.studiesAtHome,
      movingDate: p.movingDate ?? p.moveInDate,
      city: p.city ?? ''
    };
  }
}
