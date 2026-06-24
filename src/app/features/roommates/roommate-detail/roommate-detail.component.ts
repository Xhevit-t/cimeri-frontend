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
          this.profile = p;
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
      targetType: 'USER',
      targetId: this.profile.userId,
      description: this.message
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
}
