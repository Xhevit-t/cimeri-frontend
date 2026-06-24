import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { User, UpdateUserRequest, PagedResponse } from '../../shared/models/user.model';

/**
 * User account operations.
 *
 * Backend paths:
 *   GET    /users/me
 *   PUT    /users/me
 *   DELETE /users/me
 *   GET    /users
 *   GET    /users/{id}
 *   POST   /users/{id}/block
 *   DELETE /users/{id}/block
 *   GET    /users/me/blocked
 */
@Injectable({ providedIn: 'root' })
export class UserService {
  private api = inject(ApiService);

  /** GET /users/me */
  getMe(): Observable<User> {
    return this.api.getMe();
  }

  /** PUT /users/me */
  updateMe(data: UpdateUserRequest): Observable<User> {
    return this.api.updateMe(data);
  }

  /** DELETE /users/me */
  deleteMe(): Observable<void> {
    return this.api.deleteMe();
  }

  /** GET /users */
  getUsers(page = 0, size = 10): Observable<User[] | PagedResponse<User>> {
    return this.api.getUsers(page, size);
  }

  /** GET /users/{id} */
  getUserById(id: number): Observable<User> {
    return this.api.getUserById(id);
  }

  /** POST /users/{id}/block */
  blockUser(id: number): Observable<void> {
    return this.api.blockUser(id);
  }

  /** DELETE /users/{id}/block */
  unblockUser(id: number): Observable<void> {
    return this.api.unblockUser(id);
  }

  /** GET /users/me/blocked */
  getBlockedUsers(): Observable<User[]> {
    return this.api.getBlockedUsers();
  }
}
