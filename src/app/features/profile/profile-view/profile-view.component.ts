import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
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
export class ProfileViewComponent implements OnInit {
  private profileSvc = inject(ProfileService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private i18n = inject(TranslationService);

  profile: Profile | null = null;
  loading = true;
  hasProfile = false;
  errorMessage = '';

  ngOnInit(): void {
    const user = this.auth.getCurrentUser();
    if (!user) {
      this.loading = false;
      return;
    }
    this.profileSvc.getProfile(user.id).subscribe({
      next: (p) => {
        this.profile = p;
        this.hasProfile = !!p;
        this.loading = false;
      },
      error: (err) => {
        if (err?.status === 404) {
          this.hasProfile = false;
        } else {
          this.errorMessage = err?.displayMessage || 'Could not load profile';
        }
        this.loading = false;
      }
    });
  }

  delete(): void {
    if (!this.profile) return;
    if (!confirm(this.i18n.t('pv.confirmDel'))) return;
    this.profileSvc.deleteProfile(this.profile.id).subscribe({
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
}
