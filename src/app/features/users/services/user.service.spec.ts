// src/app/features/users/services/user.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import { environment } from '../../../../environments/environment';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  const base = `${environment.apiUrl}/users`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        UserService,
      ],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('getAll() hace GET a /users', () => {
    service.getAll().subscribe(res => expect(res.success).toBe(true));
    const req = httpMock.expectOne(base);
    expect(req.request.method).toBe('GET');
    req.flush({ success: true, data: [], error: null });
  });

  it('create() envía rol_id como número', () => {
    const dto = {
      usuario: 'nuevo', contrasena: 'pass123',
      nombre: 'Ana', apellidos: 'García', rol_id: 2
    };
    service.create(dto).subscribe();
    const req = httpMock.expectOne(base);
    expect(req.request.method).toBe('POST');
    expect(typeof req.request.body.rol_id).toBe('number');
    req.flush({ success: true, data: {}, error: null });
  });

  it('setStatus() hace PATCH a /users/{id}/status', () => {
    service.setStatus(3, { activo: false }).subscribe();
    const req = httpMock.expectOne(`${base}/3/status`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ activo: false });
    req.flush({ success: true, data: {}, error: null });
  });
});
