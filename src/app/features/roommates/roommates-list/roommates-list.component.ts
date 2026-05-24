import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatchingService } from '../../../core/services/matching.service';
import { AuthService } from '../../../core/services/auth.service';
import { Profile } from '../../../shared/models/profile.model';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-roommates-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TranslatePipe],
  templateUrl: './roommates-list.component.html',
  styleUrl: './roommates-list.component.css'
})
export class RoommatesListComponent implements OnInit {
  private matching = inject(MatchingService);
  private auth = inject(AuthService);

  roommates: Profile[] = [];
  filtered: Profile[] = [];
  loading = true;

  searchCity = '';
  filterLifestyle = '';
  filterMaxBudget?: number;

  lifestyles = ['QUIET', 'SOCIAL', 'BALANCED', 'STUDIOUS'];

  ngOnInit(): void {
    const user = this.auth.getCurrentUser();
    if (!user) {
      this.loading = false;
      return;
    }
    this.matching.getRoommateMatches(user.id).subscribe({
      next: (data) => {
        this.roommates = data ?? [];
        this.filtered = [...this.roommates];
        this.loading = false;
      },
      error: () => {
        this.roommates = [];
        this.filtered = [];
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.filtered = this.roommates.filter((r) => {
      if (this.searchCity && !r.city?.toLowerCase().includes(this.searchCity.toLowerCase())) {
        return false;
      }
      if (this.filterLifestyle && r.lifestyle !== this.filterLifestyle) {
        return false;
      }
      if (this.filterMaxBudget && r.budgetMax > this.filterMaxBudget) {
        return false;
      }
      return true;
    });
  }

  clear(): void {
    this.searchCity = '';
    this.filterLifestyle = '';
    this.filterMaxBudget = undefined;
    this.filtered = [...this.roommates];
  }
}
