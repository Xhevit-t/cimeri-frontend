import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { retry, timer } from 'rxjs';

/**
 * Transient-failure retry, tuned for the Render free tier.
 *
 * The backend sleeps after ~15 min idle. While it spins up (a cold start, often
 * 30–60s) the gateway in front of it returns 502/503/504 — the request never
 * reaches the application. A backoff lets a later attempt land once the instance
 * is warm, and each attempt nudges it further awake.
 *
 * A gateway 502/503/504 means the request did NOT reach the app, so the write was
 * never applied server-side — it is therefore safe to retry for ALL methods,
 * including writes (POST/PUT/PATCH/DELETE). This is what lets a user create a
 * property ("imot") on the first attempt after the backend has gone idle instead
 * of seeing "Server error — please try again later".
 *
 * Deliberately NOT retried:
 *  - status 0 — CORS rejection, hard network failure, or a cancelled request.
 *    Retrying cannot fix any of those; fail fast so the real error surfaces.
 *  - status 500 — an application-level failure: the request reached the app and
 *    it threw (e.g. invalid enum). Retrying just repeats the same error and, for
 *    a create, risks a duplicate. Surface it instead.
 *  - any other 4xx (incl. 401) — 401 must fall through to authInterceptor.
 *
 * Placed innermost (closest to the backend) so retries happen on the raw HTTP
 * call, before auth/error processing treats the failure as final.
 */
const MAX_RETRIES = 4;
const GATEWAY_STATUSES = [502, 503, 504];

export const retryInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    retry({
      count: MAX_RETRIES,
      delay: (error, retryCount) => {
        const status = error instanceof HttpErrorResponse ? error.status : -1;

        if (!GATEWAY_STATUSES.includes(status)) {
          // Not a cold-start gateway error — stop retrying and propagate.
          throw error;
        }

        // Backoff: 1.5s, 3s, 4.5s, 6s — rides out a Render cold start.
        return timer(retryCount * 1500);
      }
    })
  );
};
