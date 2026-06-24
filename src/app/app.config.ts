import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
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
