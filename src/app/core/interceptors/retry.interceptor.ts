import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { retry, timer } from 'rxjs';

/**
 * Transient-failure retry, tuned for the Render free tier.
 *
 * The backend sleeps after ~15 min idle and its edge can briefly return a
 * gateway error (502/503/504) while the instance spins up. A short backoff lets
 * the next attempt land once it is warm.
 *
 * Deliberately NOT retried:
 *  - status 0 — this is a CORS rejection, a hard network failure, or a
 *    cancelled request. Retrying cannot fix any of those; it only delays the
 *    error the user needs to see (e.g. a CORS-blocked login). Fail fast instead.
 *  - non-idempotent methods (POST/PUT/PATCH/DELETE) — a write that may have been
 *    applied server-side must never be silently repeated.
 *  - 4xx (incl. 401) — 401 must fall through to authInterceptor's refresh logic.
 *
 * Placed innermost (closest to the backend) so retries happen on the raw HTTP
 * call, before auth/error processing treats the failure as final.
 */
const MAX_RETRIES = 2;
const GATEWAY_STATUSES = [502, 503, 504];
const SAFE_METHODS = ['GET', 'HEAD', 'OPTIONS'];

export const retryInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    retry({
      count: MAX_RETRIES,
      delay: (error, retryCount) => {
        const status = error instanceof HttpErrorResponse ? error.status : -1;
        const retryable =
          SAFE_METHODS.includes(req.method) && GATEWAY_STATUSES.includes(status);

        if (!retryable) {
          // Re-throw to stop retrying and propagate to the next interceptor.
          throw error;
        }

        // Backoff: 1s, 2s — enough to ride out a brief cold-start gateway blip.
        return timer(retryCount * 1000);
      }
    })
  );
};
