import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        auth.logout();
        router.navigate(['/login']);
      }

      let message = 'An unexpected error occurred';
      if (error.error?.message) {
        message = error.error.message;
      } else if (typeof error.error === 'string') {
        message = error.error;
      } else if (error.message) {
        message = error.message;
      }

      console.error('[HTTP error]', error.status, message);
      return throwError(() => ({ ...error, displayMessage: message }));
    })
  );
};
