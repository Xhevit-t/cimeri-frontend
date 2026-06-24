import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
  UpdateUserRequest,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  AdminStats,
  PagedResponse
} from '../../shared/models/user.model';
import { Profile, ProfileUpsertRequest, ProfileFilter } from '../../shared/models/profile.model';
import { Property, PropertyCreateRequest, PropertyFilter } from '../../shared/models/property.model';
import {
  ForumPost,
  ForumComment,
  ForumPostCreate,
  ForumCategory
} from '../../shared/models/forum.model';
import {
  ContactRequest,
  ContactRequestCreate
} from '../../shared/models/request.model';
import { Report, ReportCreate, ModeratorReportUpdate, ReportStatus } from '../../shared/models/report.model';

const BASE = environment.apiUrl;

/**
 * Central HTTP API layer for the FlatBuddy backend.
 * All methods return Observables — no subscriptions inside this service.
 * The authInterceptor automatically attaches Bearer tokens.
 * DO NOT add login/register calls elsewhere — they remain here as the
 * canonical public entry points used by AuthService.
 */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);

  // ─────────────────────────────────────────────
  // AUTH (public — called by AuthService only)
  // ─────────────────────────────────────────────

  /** POST /auth/login — PUBLIC */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${BASE}/auth/login`, credentials);
  }

  /** POST /auth/register — PUBLIC */
  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${BASE}/auth/register`, data);
  }

  /** POST /auth/logout — PROTECTED */
  logout(): Observable<void> {
    return this.http.post<void>(`${BASE}/auth/logout`, {});
  }

  /** POST /auth/refresh — PUBLIC (called by refreshInterceptor) */
  refreshToken(refreshToken: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${BASE}/auth/refresh`, { refreshToken });
  }

  /** POST /auth/change-password — PROTECTED */
  changePassword(data: ChangePasswordRequest): Observable<void> {
    return this.http.post<void>(`${BASE}/auth/change-password`, data);
  }

  /** POST /auth/forgot-password — PUBLIC */
  forgotPassword(data: ForgotPasswordRequest): Observable<void> {
    return this.http.post<void>(`${BASE}/auth/forgot-password`, data);
  }

  /** POST /auth/reset-password?token=&newPassword= — PUBLIC */
  resetPassword(token: string, newPassword: string): Observable<void> {
    const params = new HttpParams().set('token', token).set('newPassword', newPassword);
    return this.http.post<void>(`${BASE}/auth/reset-password`, {}, { params });
  }

  /** GET /auth/verify-email?token= — PUBLIC */
  verifyEmail(token: string): Observable<void> {
    const params = new HttpParams().set('token', token);
    return this.http.get<void>(`${BASE}/auth/verify-email`, { params });
  }

  // ─────────────────────────────────────────────
  // USERS
  // ─────────────────────────────────────────────

  /** GET /users/me */
  getMe(): Observable<User> {
    return this.http.get<User>(`${BASE}/users/me`);
  }

  /** PUT /users/me */
  updateMe(data: UpdateUserRequest): Observable<User> {
    return this.http.put<User>(`${BASE}/users/me`, data);
  }

  /** DELETE /users/me */
  deleteMe(): Observable<void> {
    return this.http.delete<void>(`${BASE}/users/me`);
  }

  /** GET /users */
  getUsers(page = 0, size = 10): Observable<User[] | PagedResponse<User>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<User[] | PagedResponse<User>>(`${BASE}/users`, { params });
  }

  /** GET /users/{id} */
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${BASE}/users/${id}`);
  }

  /** POST /users/{id}/block */
  blockUser(id: number): Observable<void> {
    return this.http.post<void>(`${BASE}/users/${id}/block`, {});
  }

  /** DELETE /users/{id}/block */
  unblockUser(id: number): Observable<void> {
    return this.http.delete<void>(`${BASE}/users/${id}/block`);
  }

  /** GET /users/me/blocked */
  getBlockedUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${BASE}/users/me/blocked`);
  }

  // ─────────────────────────────────────────────
  // ROOMMATE PROFILES
  // ─────────────────────────────────────────────

  /** GET /profiles/me */
  getMyProfile(): Observable<Profile> {
    return this.http.get<Profile>(`${BASE}/profiles/me`);
  }

  /** PUT /profiles/me (upsert) */
  upsertMyProfile(data: ProfileUpsertRequest): Observable<Profile> {
    return this.http.put<Profile>(`${BASE}/profiles/me`, data);
  }

  /** DELETE /profiles/me */
  deleteMyProfile(): Observable<void> {
    return this.http.delete<void>(`${BASE}/profiles/me`);
  }

  /** GET /profiles/user/{userId} */
  getProfileByUserId(userId: number): Observable<Profile> {
    return this.http.get<Profile>(`${BASE}/profiles/user/${userId}`);
  }

  /** GET /profiles/recommendations */
  getRecommendations(filter: ProfileFilter = {}): Observable<PagedResponse<Profile>> {
    let params = new HttpParams();
    if (filter.city) params = params.set('city', filter.city);
    if (filter.lifestyle) params = params.set('lifestyle', filter.lifestyle);
    if (filter.accommodationType) params = params.set('accommodationType', filter.accommodationType);
    if (filter.minBudget !== undefined) params = params.set('minBudget', filter.minBudget);
    if (filter.maxBudget !== undefined) params = params.set('maxBudget', filter.maxBudget);
    params = params.set('page', filter.page ?? 0).set('size', filter.size ?? 10);
    return this.http.get<PagedResponse<Profile>>(`${BASE}/profiles/recommendations`, { params });
  }

  // ─────────────────────────────────────────────
  // PROPERTIES
  // ─────────────────────────────────────────────

  /** GET /properties */
  getProperties(filter: PropertyFilter = {}): Observable<PagedResponse<Property>> {
    let params = new HttpParams();
    if (filter.city) params = params.set('city', filter.city);
    if (filter.accommodationType) params = params.set('accommodationType', filter.accommodationType);
    if (filter.minPrice !== undefined) params = params.set('minPrice', filter.minPrice);
    if (filter.maxPrice !== undefined) params = params.set('maxPrice', filter.maxPrice);
    if (filter.rooms !== undefined) params = params.set('rooms', filter.rooms);
    if (filter.furnished !== undefined) params = params.set('furnished', filter.furnished);
    if (filter.internet !== undefined) params = params.set('internet', filter.internet);
    if (filter.parking !== undefined) params = params.set('parking', filter.parking);
    if (filter.petsAllowed !== undefined) params = params.set('petsAllowed', filter.petsAllowed);
    params = params.set('page', filter.page ?? 0).set('size', filter.size ?? 10);
    return this.http.get<PagedResponse<Property>>(`${BASE}/properties`, { params });
  }

  /** POST /properties */
  createProperty(data: PropertyCreateRequest): Observable<Property> {
    return this.http.post<Property>(`${BASE}/properties`, data);
  }

  /** GET /properties/{id} */
  getPropertyById(id: number): Observable<Property> {
    return this.http.get<Property>(`${BASE}/properties/${id}`);
  }

  /** PUT /properties/{id} */
  updateProperty(id: number, data: Partial<PropertyCreateRequest>): Observable<Property> {
    return this.http.put<Property>(`${BASE}/properties/${id}`, data);
  }

  /** DELETE /properties/{id} */
  deleteProperty(id: number): Observable<void> {
    return this.http.delete<void>(`${BASE}/properties/${id}`);
  }

  /** PATCH /properties/{id}/active?value=true|false */
  setPropertyActive(id: number, value: boolean): Observable<Property> {
    const params = new HttpParams().set('value', value);
    return this.http.patch<Property>(`${BASE}/properties/${id}/active`, {}, { params });
  }

  /** GET /properties/owner/{ownerId} */
  getPropertiesByOwner(ownerId: number): Observable<Property[]> {
    return this.http.get<Property[]>(`${BASE}/properties/owner/${ownerId}`);
  }

  // ─────────────────────────────────────────────
  // CONTACT REQUESTS
  // ─────────────────────────────────────────────

  /** POST /contact-requests */
  createContactRequest(data: ContactRequestCreate): Observable<ContactRequest> {
    return this.http.post<ContactRequest>(`${BASE}/contact-requests`, data);
  }

  /** POST /contact-requests/{id}/accept */
  acceptContactRequest(id: number): Observable<ContactRequest> {
    return this.http.post<ContactRequest>(`${BASE}/contact-requests/${id}/accept`, {});
  }

  /** POST /contact-requests/{id}/reject */
  rejectContactRequest(id: number): Observable<ContactRequest> {
    return this.http.post<ContactRequest>(`${BASE}/contact-requests/${id}/reject`, {});
  }

  /** GET /contact-requests/inbox */
  getContactRequestInbox(page = 0, size = 10): Observable<PagedResponse<ContactRequest>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PagedResponse<ContactRequest>>(`${BASE}/contact-requests/inbox`, { params });
  }

  /** GET /contact-requests/outbox */
  getContactRequestOutbox(page = 0, size = 10): Observable<PagedResponse<ContactRequest>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PagedResponse<ContactRequest>>(`${BASE}/contact-requests/outbox`, { params });
  }

  /**
   * GET /contact-requests/counts
   * Backend returns a dynamic map keyed by status name, e.g. { "PENDING": 3 }.
   * RequestService normalizes it into a RequestCounts shape.
   */
  getContactRequestCounts(): Observable<Record<string, number>> {
    return this.http.get<Record<string, number>>(`${BASE}/contact-requests/counts`);
  }

  // ─────────────────────────────────────────────
  // FORUM
  // ─────────────────────────────────────────────

  /** GET /forum/posts */
  getForumPosts(category?: ForumCategory | string, keyword?: string, page = 0, size = 10): Observable<PagedResponse<ForumPost>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (category) params = params.set('category', category);
    if (keyword) params = params.set('keyword', keyword);
    return this.http.get<PagedResponse<ForumPost>>(`${BASE}/forum/posts`, { params });
  }

  /** POST /forum/posts */
  createForumPost(data: ForumPostCreate): Observable<ForumPost> {
    return this.http.post<ForumPost>(`${BASE}/forum/posts`, data);
  }

  /** GET /forum/posts/{id} */
  getForumPostById(id: number): Observable<ForumPost> {
    return this.http.get<ForumPost>(`${BASE}/forum/posts/${id}`);
  }

  /** DELETE /forum/posts/{id} */
  deleteForumPost(id: number): Observable<void> {
    return this.http.delete<void>(`${BASE}/forum/posts/${id}`);
  }

  /** GET /forum/posts/{id}/comments */
  getForumComments(postId: number): Observable<ForumComment[]> {
    return this.http.get<ForumComment[]>(`${BASE}/forum/posts/${postId}/comments`);
  }

  /** POST /forum/posts/{id}/comments */
  addForumComment(postId: number, content: string): Observable<ForumComment> {
    return this.http.post<ForumComment>(`${BASE}/forum/posts/${postId}/comments`, { content });
  }

  /** DELETE /forum/comments/{id} */
  deleteForumComment(commentId: number): Observable<void> {
    return this.http.delete<void>(`${BASE}/forum/comments/${commentId}`);
  }

  // ─────────────────────────────────────────────
  // REPORTS
  // ─────────────────────────────────────────────

  /** POST /reports */
  createReport(data: ReportCreate): Observable<Report> {
    return this.http.post<Report>(`${BASE}/reports`, data);
  }

  // ─────────────────────────────────────────────
  // MODERATOR
  // ─────────────────────────────────────────────

  /** GET /moderator/reports */
  getModeratorReports(status?: ReportStatus, page = 0, size = 10): Observable<PagedResponse<Report>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (status) params = params.set('status', status);
    return this.http.get<PagedResponse<Report>>(`${BASE}/moderator/reports`, { params });
  }

  /** PATCH /moderator/reports/{id} */
  updateReportStatus(id: number, data: ModeratorReportUpdate): Observable<Report> {
    return this.http.patch<Report>(`${BASE}/moderator/reports/${id}`, data);
  }

  // ─────────────────────────────────────────────
  // ADMIN
  // ─────────────────────────────────────────────

  /** GET /admin/users */
  getAdminUsers(page = 0, size = 10): Observable<PagedResponse<User>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PagedResponse<User>>(`${BASE}/admin/users`, { params });
  }

  /** PATCH /admin/users/{id}/block */
  adminBlockUser(id: number): Observable<void> {
    return this.http.patch<void>(`${BASE}/admin/users/${id}/block`, {});
  }

  /** PATCH /admin/users/{id}/unblock */
  adminUnblockUser(id: number): Observable<void> {
    return this.http.patch<void>(`${BASE}/admin/users/${id}/unblock`, {});
  }

  /** GET /admin/stats */
  getAdminStats(): Observable<AdminStats> {
    return this.http.get<AdminStats>(`${BASE}/admin/stats`);
  }
}
