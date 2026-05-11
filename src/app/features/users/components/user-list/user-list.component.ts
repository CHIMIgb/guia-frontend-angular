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
  styleUrl: './user-list.component.scss',
})
export class UserListComponent implements OnInit {
  private userService = inject(UserService);
  private authService = inject(AuthService);

  readonly users      = signal<User[]>([]);
  readonly isLoading  = signal(true);
  readonly error      = signal<string | null>(null);
  readonly successMsg = signal<string | null>(null);

  readonly isAdmin = this.authService.currentUser()?.roles.includes('admin') ?? false;

  ngOnInit(): void { this.loadUsers(); }

  loadUsers(): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.userService.getAll().subscribe({
      next: (res) => {
        this.users.set(res.data?.items ?? []);
        this.isLoading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        const msg = err?.error?.error?.message
          ?? 'No se pudieron cargar los usuarios.';
        this.error.set(msg);
        this.isLoading.set(false);
      }
    });
  }

  toggleStatus(user: User): void {
    const action = user.activo ? 'desactivar' : 'activar';
    this.userService.setStatus(user.id, { activo: !user.activo }).subscribe({
      next: () => {
        this.showSuccess(`Usuario "${user.usuario}" ${action === 'activar' ? 'activado' : 'desactivado'} correctamente.`);
        this.loadUsers();
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(err?.error?.error?.message ?? `Error al ${action} el usuario.`);
      }
    });
  }

  deleteUser(user: User): void {
    if (!confirm(`¿Eliminar permanentemente al usuario "${user.usuario}"?`)) return;
    this.userService.delete(user.id).subscribe({
      next: () => {
        this.showSuccess(`Usuario "${user.usuario}" eliminado correctamente.`);
        this.loadUsers();
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(err?.error?.error?.message ?? 'Error al eliminar el usuario.');
      }
    });
  }

  private showSuccess(msg: string): void {
    this.successMsg.set(msg);
    setTimeout(() => this.successMsg.set(null), 4000);
  }
}
