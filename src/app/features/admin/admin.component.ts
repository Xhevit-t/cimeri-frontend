import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AdminService } from '../../core/services/admin.service';
import { User, AdminStats, PagedResponse } from '../../shared/models/user.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit, OnDestroy {
  private adminSvc = inject(AdminService);
  private destroy$ = new Subject<void>();

  stats: AdminStats | null = null;
  users: User[] = [];
  statsLoading = true;
  usersLoading = true;
  statsError = '';
  usersError = '';
  actionMessage = '';

  page = 0;
  pageSize = 10;
  totalUsers = 0;

  ngOnInit(): void {
    this.loadStats();
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadStats(): void {
    this.statsLoading = true;
    this.adminSvc.getStats()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.stats = data;
          this.statsLoading = false;
        },
        error: (err) => {
          this.statsError = err?.displayMessage || 'Could not load stats';
          this.statsLoading = false;
        }
      });
  }

  loadUsers(): void {
    this.usersLoading = true;
    this.adminSvc.getUsers(this.page, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: PagedResponse<User>) => {
          this.users = res.content ?? [];
          this.totalUsers = res.totalElements ?? 0;
          this.usersLoading = false;
        },
        error: (err) => {
          this.usersError = err?.displayMessage || 'Could not load users';
          this.usersLoading = false;
        }
      });
  }

  blockUser(user: User): void {
    this.actionMessage = '';
    this.adminSvc.blockUser(user.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          user.blocked = true;
          this.actionMessage = `${user.firstName} ${user.lastName} has been blocked.`;
        },
        error: (err) => (this.actionMessage = err?.displayMessage || 'Action failed')
      });
  }

  unblockUser(user: User): void {
    this.actionMessage = '';
    this.adminSvc.unblockUser(user.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          user.blocked = false;
          this.actionMessage = `${user.firstName} ${user.lastName} has been unblocked.`;
        },
        error: (err) => (this.actionMessage = err?.displayMessage || 'Action failed')
      });
  }

  nextPage(): void {
    this.page++;
    this.loadUsers();
  }

  prevPage(): void {
    if (this.page > 0) {
      this.page--;
      this.loadUsers();
    }
  }

  get totalPages(): number {
    return Math.ceil(this.totalUsers / this.pageSize);
  }
}
