// src/app/features/users/guards/role.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router      = inject(Router);

  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/auth/login']);
  }

  const requiredRoles = route.data['roles'] as string[] | undefined;
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  if (authService.hasAnyRole(requiredRoles)) {
    return true;
  }

  return router.createUrlTree(['/forbidden']);
};
