import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { retryInterceptor } from './core/interceptors/retry.interceptor';
import { mockInterceptor } from './core/mock/mock.interceptor';


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // Classic Zone.js change detection. The whole app updates plain component
    // fields inside subscribe() callbacks (no signals / markForCheck), so it
    // relies on Zone.js to run change detection when async work completes.
    // Without this (and the zone.js polyfill in angular.json) the view renders
    // once and then freezes until a user event forces a tick.
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    // Order matters (outermost → innermost on the request, reverse on the response):
    //   error  — outermost: normalizes the final error into `displayMessage`.
    //   auth   — attaches the bearer and runs the 401→refresh retry. MUST sit
    //            inside error, otherwise error strips the HttpErrorResponse type
    //            and auth's `instanceof HttpErrorResponse` check never matches.
    //   retry  — innermost: retries cold-start/transient failures on the raw call.
    provideHttpClient(
      withInterceptors([mockInterceptor, errorInterceptor, authInterceptor, retryInterceptor])
    )
  ]
};
