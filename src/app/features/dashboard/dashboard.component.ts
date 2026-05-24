import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { MatchingService } from '../../core/services/matching.service';
import { RequestService } from '../../core/services/request.service';
import { Profile } from '../../shared/models/profile.model';
import { Property } from '../../shared/models/property.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private auth = inject(AuthService);
  private matching = inject(MatchingService);
  private requests = inject(RequestService);

  roommates: Profile[] = [];
  properties: Property[] = [];
  incomingCount = 0;
  loading = true;

  ngOnInit(): void {
    const user = this.auth.getCurrentUser();
    if (!user) {
      this.loading = false;
      return;
    }

    this.matching.getRoommateMatches(user.id).subscribe({
      next: (data) => (this.roommates = data?.slice(0, 4) ?? []),
      error: () => (this.roommates = [])
    });

    this.matching.getPropertyMatches(user.id).subscribe({
      next: (data) => (this.properties = data?.slice(0, 4) ?? []),
      error: () => (this.properties = [])
    });

    this.requests.getIncoming().subscribe({
      next: (data) => {
        this.incomingCount = data?.filter((r) => r.status === 'PENDING').length ?? 0;
        this.loading = false;
      },
      error: () => {
        this.incomingCount = 0;
        this.loading = false;
      }
    });
  }

  get firstName(): string {
    return this.auth.getCurrentUser()?.firstName ?? 'there';
  }
}
