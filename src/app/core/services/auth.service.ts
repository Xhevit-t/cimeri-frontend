import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../../shared/models/user.model';

/** localStorage key for the JWT — read by authInterceptor on every HTTP call. */
const TOKEN_KEY = 'flatbuddy_token';
const REFRESH_TOKEN_KEY = 'flatbuddy_refresh_token';
const USER_KEY = 'flatbuddy_user';

/**
 * Session management: stores JWT after login/register and exposes auth state.
 * HTTP calls are delegated to ApiService; this service owns the token lifecycle.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = inject(ApiService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  readonly currentUser = signal<User | null>(this.loadUser());
  readonly isLoggedIn = signal<boolean>(!!this.getToken());

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.api.register(data).pipe(tap((res) => this.storeSession(res)));
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.api.login(data).pipe(tap((res) => this.storeSession(res)));
  }

  logout(): void {
    this.clearSession();
    this.router.navigate(['/login']);
  }

  /** Clears stored credentials without navigating (used by error interceptor). */
  clearSession(): void {
    if (this.isBrowser) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
    this.currentUser.set(null);
    this.isLoggedIn.set(false);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem(TOKEN_KEY);
  }

  getCurrentUser(): User | null {
    return this.currentUser();
  }

  private storeSession(res: AuthResponse): void {
    if (this.isBrowser) {
      localStorage.setItem(TOKEN_KEY, res.token);
      if (res.refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, res.refreshToken);
      }
      localStorage.setItem(USER_KEY, JSON.stringify(res.user));
    }
    this.currentUser.set(res.user);
    this.isLoggedIn.set(true);
  }

  private loadUser(): User | null {
    if (!this.isBrowser) return null;
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  }
}
