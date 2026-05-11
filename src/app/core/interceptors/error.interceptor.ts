// src/app/core/interceptors/error.interceptor.ts
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError, switchMap, EMPTY } from 'rxjs';
import { AuthService } from '../../features/auth/services/auth.service';

/**
 * Maneja errores HTTP:
 *  - 401 TOKEN_EXPIRED  → intenta refresh automático, reintenta la petición.
 *  - 401 TOKEN_REVOKED  → el token fue invalidado por logout; limpia sesión.
 *  - 401 otros          → limpia sesión y redirige a /auth/login.
 *  - 403                → redirige a /forbidden.
 *  - 500+               → propaga el error para que el componente lo maneje.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router      = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {

      if (error.status === 401) {
        const apiCode = error.error?.error?.code as string | undefined;

        // Token expirado → intentar renovar de forma transparente
        if (apiCode === 'TOKEN_EXPIRED') {
          const refresh$ = authService.refreshTokens();
          if (refresh$ === EMPTY) {
            authService.logout();
            return EMPTY;
          }
          return refresh$.pipe(
            switchMap(() => {
              const newToken = authService.accessToken();
              const retryReq = req.clone({
                setHeaders: { Authorization: `Bearer ${newToken}` }
              });
              return next(retryReq);
            }),
            catchError(() => {
              authService.logout();
              return EMPTY;
            })
          );
        }

        // Token revocado (logout en otro dispositivo, en lista negra)
        // No intentar refresh; limpiar sesión directamente.
        if (apiCode === 'TOKEN_REVOKED') {
          authService.logout();
          return EMPTY;
        }

        // Cualquier otro 401 (token inválido, sin token)
        authService.logout();
        return EMPTY;
      }

      // 403 — Sin el rol requerido
      if (error.status === 403) {
        router.navigate(['/forbidden']);
        return EMPTY;
      }

      return throwError(() => error);
    })
  );
};
