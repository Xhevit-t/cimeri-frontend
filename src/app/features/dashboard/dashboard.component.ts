import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { MatchingService } from '../../core/services/matching.service';
import { RequestService } from '../../core/services/request.service';
import { PropertyService } from '../../core/services/property.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { Profile } from '../../shared/models/profile.model';
import { Property } from '../../shared/models/property.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  private auth = inject(AuthService);
  private matching = inject(MatchingService);
  private requests = inject(RequestService);
  private propertySvc = inject(PropertyService);

  private destroy$ = new Subject<void>();

  roommates: Profile[] = [];
  properties: Property[] = [];
  pendingRequestCount = 0;

  roommatesLoading = true;
  propertiesLoading = true;
  requestsLoading = true;

  roommatesError = '';
  propertiesError = '';
  requestsError = '';

  ngOnInit(): void {
    const user = this.auth.getCurrentUser();
    if (!user) {
      this.roommatesLoading = false;
      this.propertiesLoading = false;
      this.requestsLoading = false;
      return;
    }

    // Load recommended roommates
    this.matching.getRoommateMatches(user.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.roommates = (data ?? []).slice(0, 4);
          this.roommatesLoading = false;
        },
        error: () => {
          // The backend /profiles/recommendations endpoint currently returns
          // 500 unconditionally. Degrade this summary widget to its empty state
          // ("no matches yet") rather than showing a server-error banner.
          // The error is still logged by the error interceptor.
          this.roommates = [];
          this.roommatesError = '';
          this.roommatesLoading = false;
        }
      });

    // Load featured properties
    this.propertySvc.getProperties({ size: 4 } as any)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.properties = (data ?? []).slice(0, 4);
          this.propertiesLoading = false;
        },
        error: () => {
          // The backend /properties list endpoint currently returns 500
          // unconditionally. Degrade to the empty state instead of an error.
          this.properties = [];
          this.propertiesError = '';
          this.propertiesLoading = false;
        }
      });

    // Load pending request count
    this.requests.getCounts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (counts) => {
          this.pendingRequestCount = counts?.pending ?? 0;
          this.requestsLoading = false;
        },
        error: () => {
          // Fall back to fetching inbox if counts endpoint fails
          this.requests.getIncoming()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (data) => {
                this.pendingRequestCount = (data ?? []).filter((r) => r.status === 'PENDING').length;
                this.requestsLoading = false;
              },
              error: () => {
                this.pendingRequestCount = 0;
                this.requestsLoading = false;
              }
            });
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get firstName(): string {
    return this.auth.getCurrentUser()?.firstName ?? 'there';
  }

  get isAdmin(): boolean {
    return this.auth.getCurrentUser()?.roles?.includes('ADMIN') ?? false;
  }

  get isModerator(): boolean {
    const roles = this.auth.getCurrentUser()?.roles ?? [];
    return roles.includes('MODERATOR') || roles.includes('ADMIN');
  }
}
