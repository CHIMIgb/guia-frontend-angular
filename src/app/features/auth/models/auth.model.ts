export interface LoginRequest {
  usuario: string;
  contrasena: string;
}

export interface TokenUser {
  id: number;
  usuario: string;
  nombre: string;
  apellidos: string;
  roles: string[];
}

export interface TokenPayload {
  sub: number;
  user: TokenUser;
  iat: number;
  exp: number;
}

export interface ApiError {
  code: string;
  message: string;
  details: unknown;
}

export interface AuthResponse {
  success: boolean;
  data: {
    access_token: string;
    refresh_token: string;
    user: TokenUser;
  } | null;
  error: ApiError | null;
}

export interface ValidateResponse {
  success: boolean;
  data: {
    expires_in_seconds: number;
    payload: TokenPayload;
  } | null;
  error: ApiError | null;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T | null;
  error: ApiError | null;
}
