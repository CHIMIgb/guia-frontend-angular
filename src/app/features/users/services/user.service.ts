// src/app/features/users/services/user.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../auth/models/auth.model';
import { User, CreateUserDto, UpdateUserDto, PatchUserDto, UserStatusDto } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/users`;

  /** GET /api/v1/users — Lista todos los usuarios activos */
  getAll(): Observable<ApiResponse<{ items: User[] }>> {
    return this.http.get<ApiResponse<{ items: User[] }>>(this.base);
  }

  /** GET /api/v1/users/{id} */
  getById(id: number): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.base}/${id}`);
  }

  /** POST /api/v1/users — Solo admin. Envía rol_id (integer) */
  create(dto: CreateUserDto): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(this.base, dto);
  }

  /** PUT /api/v1/users/{id} — Reemplaza todo el usuario */
  replace(id: number, dto: UpdateUserDto): Observable<ApiResponse<User>> {
    return this.http.put<ApiResponse<User>>(`${this.base}/${id}`, dto);
  }

  /** PATCH /api/v1/users/{id} — Actualización parcial */
  patch(id: number, dto: PatchUserDto): Observable<ApiResponse<User>> {
    return this.http.patch<ApiResponse<User>>(`${this.base}/${id}`, dto);
  }

  /** PATCH /api/v1/users/{id}/status — Activar/desactivar */
  setStatus(id: number, dto: UserStatusDto): Observable<ApiResponse<User>> {
    return this.http.patch<ApiResponse<User>>(`${this.base}/${id}/status`, dto);
  }

  /** DELETE /api/v1/users/{id} — Eliminación física. Solo admin */
  delete(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.base}/${id}`);
  }
}
