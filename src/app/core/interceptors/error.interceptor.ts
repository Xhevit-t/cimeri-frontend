import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

const isPublicAuthRequest = (url: string): boolean =>
  url.includes('/auth/login') || url.includes('/auth/register');

/**
 * Global HTTP error handler.
 *
 * Token refresh on 401 is handled by authInterceptor.
 * This interceptor normalizes error shapes so components get a consistent
 * `displayMessage` property from every error.
 *
 * - 401 on login/register: surfaced as invalid-credentials message
 * - 403: access denied — do not log out
 * - 404: not found — surfaced to component
 * - 5xx: generic server error message
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = 'An unexpected error occurred';

      if (error.status === 0) {
        message = 'Could not reach the server. Please check your connection and try again.';
      } else if (error.status === 401 && isPublicAuthRequest(req.url)) {
        message = error.error?.message || 'Invalid email or password';
      } else if (error.status === 403) {
        message = 'You do not have permission to perform this action';
      } else if (error.status === 404) {
        message = error.error?.message || 'Resource not found';
      } else if (error.status === 409) {
        message = error.error?.message || 'This resource already exists';
      } else if (error.status >= 500) {
        message = 'Server error — please try again later';
      } else if (error.error?.message) {
        message = error.error.message;
      } else if (typeof error.error === 'string') {
        message = error.error;
      } else if (error.message) {
        message = error.message;
      }

      if (!error.url?.includes('/auth/refresh')) {
        console.error('[HTTP error]', error.status, req.url, message);
      }

      return throwError(() => ({ ...error, displayMessage: message }));
    })
  );
};
