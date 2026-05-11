// src/app/features/users/components/user-list/user-list.component.ts
import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../../auth/services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-list.component.html',
})
export class UserListComponent implements OnInit {
  private userService = inject(UserService);
  private authService = inject(AuthService);

  readonly users     = signal<User[]>([]);
  readonly isLoading = signal(true);
  readonly error     = signal<string | null>(null);

  readonly isAdmin = this.authService.currentUser()?.roles.includes('admin') ?? false;

  ngOnInit(): void { this.loadUsers(); }

  loadUsers(): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.userService.getAll().subscribe({
      next: (res) => {
        this.users.set(res.data ?? []);
        this.isLoading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        // Leer el mensaje del contrato: err.error → body API → .error.message
        const msg = err?.error?.error?.message
          ?? 'No se pudieron cargar los usuarios.';
        this.error.set(msg);
        this.isLoading.set(false);
      }
    });
  }

  toggleStatus(user: User): void {
    this.userService.setStatus(user.id, { activo: !user.activo }).subscribe({
      next: () => this.loadUsers(),
      error: (err: HttpErrorResponse) => {
        const msg = err?.error?.error?.message
          ?? 'Error al cambiar el estado del usuario.';
        this.error.set(msg);
      }
    });
  }

  deleteUser(id: number): void {
    if (!confirm('¿Eliminar este usuario?')) return;
    this.userService.delete(id).subscribe({
      next: () => this.loadUsers(),
      error: (err: HttpErrorResponse) => {
        const msg = err?.error?.error?.message
          ?? 'Error al eliminar el usuario.';
        this.error.set(msg);
      }
    });
  }
}
