import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileService } from '../../../core/services/profile.service';
import { MatchingService } from '../../../core/services/matching.service';
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
export class RoommateDetailComponent implements OnInit {
  private profileSvc = inject(ProfileService);
  private matching = inject(MatchingService);
  private requests = inject(RequestService);
  private auth = inject(AuthService);
  private router = inject(Router);

  @Input() id!: string;

  profile: Profile | null = null;
  loading = true;
  errorMessage = '';

  showRequestForm = false;
  message = '';
  sending = false;
  successMessage = '';
  compatibility?: number;

  ngOnInit(): void {
    const userId = Number(this.id);
    this.profileSvc.getProfile(userId).subscribe({
      next: (p) => {
        this.profile = p;
        this.loading = false;
        this.fetchCompatibility(userId);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.displayMessage || 'Could not load profile';
      }
    });
  }

  private fetchCompatibility(targetId: number): void {
    const me = this.auth.getCurrentUser();
    if (!me) return;
    this.matching.getCompatibilityScore(me.id, targetId).subscribe({
      next: (r) => (this.compatibility = r?.score),
      error: () => (this.compatibility = undefined)
    });
  }

  sendRequest(): void {
    if (!this.profile || !this.message.trim()) return;
    this.sending = true;
    this.requests.sendRequest({ recipientId: this.profile.userId, message: this.message }).subscribe({
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
}
