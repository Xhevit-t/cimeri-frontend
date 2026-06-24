import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { User, AdminStats, PagedResponse } from '../../shared/models/user.model';

/**
 * Admin-only operations (requires ADMIN role).
 *
 * Backend paths:
 *   GET   /admin/users
 *   PATCH /admin/users/{id}/block
 *   PATCH /admin/users/{id}/unblock
 *   GET   /admin/stats
 */
@Injectable({ providedIn: 'root' })
export class AdminService {
  private api = inject(ApiService);

  /** GET /admin/users */
  getUsers(page = 0, size = 10): Observable<PagedResponse<User>> {
    return this.api.getAdminUsers(page, size);
  }

  /** PATCH /admin/users/{id}/block */
  blockUser(id: number): Observable<void> {
    return this.api.adminBlockUser(id);
  }

  /** PATCH /admin/users/{id}/unblock */
  unblockUser(id: number): Observable<void> {
    return this.api.adminUnblockUser(id);
  }

  /** GET /admin/stats */
  getStats(): Observable<AdminStats> {
    return this.api.getAdminStats();
  }
}
