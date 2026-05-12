import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../../auth/services/auth.service';
import { User } from '../../models/user.model';
import { UserFormComponent } from '../user-form/user-form.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, UserFormComponent],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent implements OnInit {
  private userService = inject(UserService);
  private authService = inject(AuthService);

  readonly allUsers   = signal<User[]>([]);
  readonly isLoading  = signal(true);
  readonly error      = signal<string | null>(null);
  readonly successMsg = signal<string | null>(null);

  readonly isAdmin = this.authService.currentUser()?.roles.includes('admin') ?? false;

  // Estado del Modal
  readonly isModalOpen = signal(false);
  readonly selectedUserId = signal<string | undefined>(undefined);

  // Filtros y Paginación
  readonly searchTerm = signal('');
  readonly currentPage = signal(1);
  readonly pageSize = signal(10);

  // Computados para procesar la lista localmente
  readonly filteredUsers = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.allUsers();
    
    return this.allUsers().filter(u => 
      u.usuario.toLowerCase().includes(term) ||
      u.nombre.toLowerCase().includes(term) ||
      u.apellidos.toLowerCase().includes(term)
    );
  });

  readonly totalRecords = computed(() => this.filteredUsers().length);
  readonly totalPages = computed(() => Math.ceil(this.totalRecords() / this.pageSize()) || 1);

  readonly paginatedUsers = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filteredUsers().slice(start, start + this.pageSize());
  });

  readonly showingFrom = computed(() => this.totalRecords() === 0 ? 0 : (this.currentPage() - 1) * this.pageSize() + 1);
  readonly showingTo = computed(() => Math.min(this.currentPage() * this.pageSize(), this.totalRecords()));

  ngOnInit(): void { this.loadUsers(); }

  loadUsers(): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.userService.getAll().subscribe({
      next: (res) => {
        this.allUsers.set(res.data?.items ?? []);
        this.isLoading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        const msg = err?.error?.error?.message ?? 'No se pudieron cargar los usuarios.';
        this.error.set(msg);
        this.isLoading.set(false);
      }
    });
  }

  // Métodos de Paginación y Filtro
  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
    this.currentPage.set(1); // Resetear a página 1 al buscar
  }

  prevPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
    }
  }

  // Acciones CRUD
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

  openModal(userId?: number): void {
    this.selectedUserId.set(userId ? userId.toString() : undefined);
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.selectedUserId.set(undefined);
  }

  onModalSaved(): void {
    this.showSuccess(this.selectedUserId() ? 'Usuario actualizado correctamente.' : 'Usuario creado correctamente.');
    this.closeModal();
    this.loadUsers();
  }

  private showSuccess(msg: string): void {
    this.successMsg.set(msg);
    setTimeout(() => this.successMsg.set(null), 4000);
  }
}
