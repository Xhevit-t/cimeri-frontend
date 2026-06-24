import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../../shared/models/user.model';

/**
 * Checks that the authenticated user holds one of the roles listed in
 * `route.data['roles']` (array of UserRole strings).
 *
 * Usage in routes:
 *   {
 *     path: 'admin',
 *     canActivate: [authGuard, roleGuard],
 *     data: { roles: ['ADMIN'] },
 *     ...
 *   }
 *
 * Redirects to '/' (home) when the user lacks the required role.
 * Always compose with authGuard — this guard assumes the user is already
 * authenticated.
 */
export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const requiredRoles: UserRole[] = route.data['roles'] ?? [];

  if (requiredRoles.length === 0) {
    return true;
  }

  const user = auth.getCurrentUser();
  if (!user) {
    router.navigate(['/login']);
    return false;
  }

  const userRoles: string[] = user.roles ?? [];
  const hasRole = requiredRoles.some((role) => userRoles.includes(role));

  if (!hasRole) {
    router.navigate(['/']);
    return false;
  }

  return true;
};
