import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../../shared/models/user.model';

const TOKEN_KEY = 'flatbuddy_token';
const USER_KEY = 'flatbuddy_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  readonly currentUser = signal<User | null>(this.loadUser());
  readonly isLoggedIn = signal<boolean>(!!this.getToken());

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, data).pipe(
      tap((res) => this.storeSession(res))
    );
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, data).pipe(
      tap((res) => this.storeSession(res))
    );
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
    this.currentUser.set(null);
    this.isLoggedIn.set(false);
    this.router.navigate(['/login']);
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
