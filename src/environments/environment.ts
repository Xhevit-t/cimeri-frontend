/**
 * Environment configuration for API connectivity.
 *
 * CORS is sidestepped by calling a RELATIVE path (`/api`) so the browser always
 * talks to its own origin, and a server-side proxy forwards to the real backend:
 *   - dev:  proxy.conf.json (wired in angular.json) forwards /api → Render
 *   - prod: vercel.json rewrites /api → Render
 * Both strip the /api prefix, so the backend still receives /auth, /profiles, etc.
 * The backend never needs to send Access-Control-Allow-Origin for our origin.
 *
 * Render free tier: the first request after idle can take 30–60+ seconds (cold
 * start); the proxy holds the connection until the instance wakes.
 */
export const environment = {
  production: false,

  /** Relative API base — proxied to the backend in both dev and prod (see above). */
  apiUrl: '/api',

  /** Set true to use local mock data instead of the real API. */
  useMockData: false
};
