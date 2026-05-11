// src/app/features/auth/services/auth.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { AuthService } from './auth.service';
import { environment } from '../../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        AuthService,
      ],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => { httpMock.verify(); localStorage.clear(); });

  it('debería crearse', () => expect(service).toBeTruthy());

  it('no debe estar autenticado al inicio', () => {
    expect(service.isAuthenticated()).toBeFalsy();
    expect(service.currentUser()).toBeNull();
  });

  it('login exitoso guarda tokens y actualiza signals', () => {
    // Respuesta real del backend: access_token, refresh_token, user
    const mockResponse = {
      success: true,
      data: {
        access_token: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOjF9.FAKE',
        refresh_token: 'fake-refresh-token',
        user: {
          id: 1, usuario: 'admin_juan',
          nombre: 'Juan', apellidos: 'Pérez', roles: ['admin']
        }
      },
      error: null,
    };

    service.login({ usuario: 'admin_juan', contrasena: 'secret123' }).subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);

    expect(localStorage.getItem('refresh_token')).toBe('fake-refresh-token');
    expect(service.currentUser()?.roles).toContain('admin');
  });
});
