import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { ApiService } from '../services/api.service';

/** Token storage keys — must match AuthService */
const TOKEN_KEY = 'flatbuddy_token';
const REFRESH_TOKEN_KEY = 'flatbuddy_refresh_token';

/** Public endpoints that should never trigger a refresh loop */
const PUBLIC_PATHS = [
  '/auth/login',
  '/auth/register',
  '/auth/refresh',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/verify-email'
];

const isPublic = (url: string): boolean => PUBLIC_PATHS.some((p) => url.includes(p));

/**
 * Shared refresh state across all in-flight requests.
 * Module-level variables persist for the lifetime of the Angular app.
 * isRefreshing is explicitly reset to false here so that a hard navigation
 * or HMR reload never leaves it stuck at true, which would cause all
 * subsequent protected requests to hang waiting on refreshSubject forever.
 */
let isRefreshing = false;
const refreshSubject = new BehaviorSubject<string | null>(null);

const addBearer = <T>(req: HttpRequest<T>, token: string): HttpRequest<T> =>
  req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });

const handleRefresh = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  auth: AuthService,
  api: ApiService,
  platformId: object
): Observable<any> => {
  const isBrowser = isPlatformBrowser(platformId);

  if (!isRefreshing) {
    isRefreshing = true;
    // Emit null so any concurrent waiters know a refresh is in progress
    refreshSubject.next(null);

    const refreshToken = isBrowser ? localStorage.getItem(REFRESH_TOKEN_KEY) : null;

    if (!refreshToken) {
      // No refresh token stored — reset state, log out, fail fast
      isRefreshing = false;
      refreshSubject.next(null);
      auth.logout();
      return throwError(() => new Error('No refresh token available'));
    }

    return api.refreshToken(refreshToken).pipe(
      switchMap((res) => {
        isRefreshing = false;
        if (isBrowser) {
          localStorage.setItem(TOKEN_KEY, res.token);
          if (res.refreshToken) {
            localStorage.setItem(REFRESH_TOKEN_KEY, res.refreshToken);
          }
        }
        // Broadcast the new token so all waiting requests can proceed
        refreshSubject.next(res.token);
        return next(addBearer(req, res.token));
      }),
      catchError((err) => {
        // Refresh call itself failed — reset state, log out
        isRefreshing = false;
        refreshSubject.next(null);
        auth.logout();
        return throwError(() => err);
      })
    );
  }

  // A refresh is already in flight — wait for the result token then retry
  return refreshSubject.pipe(
    filter((token): token is string => token !== null),
    take(1),
    switchMap((token) => next(addBearer(req, token)))
  );
};

/**
 * Attaches `Authorization: Bearer <token>` to all outgoing requests.
 * On 401 (non-public routes): attempts a silent token refresh once.
 * On refresh failure: calls AuthService.logout() which clears storage and
 * redirects to /login.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const api = inject(ApiService);
  const platformId = inject(PLATFORM_ID);

  const token = auth.getToken();

  const outgoing = token ? addBearer(req, token) : req;

  return next(outgoing).pipe(
    catchError((error) => {
      if (
        error instanceof HttpErrorResponse &&
        error.status === 401 &&
        !isPublic(req.url)
      ) {
        return handleRefresh(req, next, auth, api, platformId);
      }
      return throwError(() => error);
    })
  );
};
