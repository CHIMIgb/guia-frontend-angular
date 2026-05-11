// src/app/features/auth/guards/auth.guard.spec.ts
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('authGuard', () => {
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        AuthService,
      ],
    });
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    localStorage.clear();
  });

  afterEach(() => localStorage.clear());

  it('permite acceso si el usuario está autenticado', () => {
    // Simular autenticación poniendo un token en localStorage
    localStorage.setItem('access_token', 'fake-token');
    // Recrear el servicio para que lea el token
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        AuthService,
      ],
    });
    authService = TestBed.inject(AuthService);

    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as any, { url: '/dashboard' } as any)
    );
    expect(result).toBe(true);
  });

  it('redirige a /auth/login si no está autenticado', () => {
    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as any, { url: '/dashboard' } as any)
    );
    expect(result).toEqual(
      router.createUrlTree(['/auth/login'], { queryParams: { returnUrl: '/dashboard' } })
    );
  });
});
