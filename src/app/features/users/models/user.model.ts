export interface User {
  id: number;
  usuario: string;
  nombre: string;
  apellidos: string;
  sexo?: string;
  activo: boolean;
  roles: string[];
}

export interface CreateUserDto {
  usuario: string;
  contrasena: string;
  nombre: string;
  apellidos: string;
  sexo?: string;
  rol_id: number;
}

export interface UpdateUserDto {
  usuario: string;
  nombre: string;
  apellidos: string;
  sexo?: string;
  roles: string[];
}

export interface PatchUserDto {
  usuario?: string;
  nombre?: string;
  apellidos?: string;
  sexo?: string;
  roles?: string[];
}

export interface UserStatusDto {
  activo: boolean;
}
