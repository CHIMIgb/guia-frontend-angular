// src/app/features/auth/services/auth.service.ts
import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, catchError, EMPTY } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { LoginRequest, AuthResponse, TokenUser } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http   = inject(HttpClient);
  private router = inject(Router);
  private api    = environment.apiUrl;

  // ── Estado reactivo con Signals ──────────────────────────────────
  private _accessToken  = signal<string | null>(this.loadToken('access_token'));
  private _refreshToken = signal<string | null>(this.loadToken('refresh_token'));
  private _currentUser  = signal<TokenUser | null>(
    this.parseTokenUser(this.loadToken('access_token'))
  );

  // Computed públicos (solo lectura)
  readonly isAuthenticated = computed(() => !!this._accessToken());
  readonly currentUser     = computed(() => this._currentUser());
  readonly accessToken     = computed(() => this._accessToken());

  // ── Métodos públicos ─────────────────────────────────────────────

  login(credentials: LoginRequest) {
    return this.http.post<AuthResponse>(`${this.api}/auth/login`, credentials).pipe(
      tap(res => this.handleAuthResponse(res))
    );
  }

  logout() {
    const token = this._accessToken();
    if (token) {
      this.http.post(`${this.api}/auth/logout`, {}).pipe(
        catchError(() => EMPTY)
      ).subscribe();
    }
    this.clearSession();
    this.router.navigate(['/auth/login']);
  }

  refreshTokens() {
    const refreshToken = this._refreshToken();
    if (!refreshToken) return EMPTY;
    return this.http.post<AuthResponse>(
      `${this.api}/auth/refresh`,
      { refresh_token: refreshToken }
    ).pipe(tap(res => this.handleAuthResponse(res)));
  }

  hasRole(role: string): boolean {
    return this._currentUser()?.roles.includes(role) ?? false;
  }

  hasAnyRole(roles: string[]): boolean {
    return roles.some(r => this.hasRole(r));
  }

  // ── Métodos privados ─────────────────────────────────────────────

  private handleAuthResponse(res: AuthResponse): void {
    if (!res.success || !res.data) return;
    const { access_token, refresh_token, user } = res.data;
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    this._accessToken.set(access_token);
    this._refreshToken.set(refresh_token);
    // Usar el objeto user de la respuesta directamente (más fiable que parsear el JWT)
    this._currentUser.set(user);
  }

  private clearSession(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this._accessToken.set(null);
    this._refreshToken.set(null);
    this._currentUser.set(null);
  }

  private loadToken(key: string): string | null {
    return localStorage.getItem(key);
  }

  private parseTokenUser(token: string | null): TokenUser | null {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.user ?? null;
    } catch {
      return null;
    }
  }
}
