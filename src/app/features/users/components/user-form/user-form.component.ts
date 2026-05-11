// src/app/features/users/components/user-form/user-form.component.ts
import { Component, inject, signal, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './user-form.component.html',
})
export class UserFormComponent implements OnInit {
  @Input() id?: string;

  private fb          = inject(FormBuilder);
  private userService = inject(UserService);
  private router      = inject(Router);

  readonly isEditing = signal(false);
  readonly isLoading = signal(false);
  readonly isSaving  = signal(false);
  readonly errorMsg  = signal<string | null>(null);

  // Mapeo de roles disponibles (nombre → id en BD)
  readonly ROLES = [
    { id: 1, nombre: 'admin' },
    { id: 2, nombre: 'editor' },
    { id: 3, nombre: 'viewer' },
  ];

  userForm = this.fb.group({
    usuario:    ['', [Validators.required, Validators.minLength(3)]],
    contrasena: ['', [Validators.minLength(6)]],
    nombre:     ['', Validators.required],
    apellidos:  ['', Validators.required],
    sexo:       [''],
    // Creación usa rol_id (integer) — edición usa roles (string[])
    rol_id:     [3, Validators.required],   // default: viewer
    roles:      [['viewer'] as string[]],
  });

  ngOnInit(): void {
    if (this.id) {
      this.isEditing.set(true);
      this.loadUser(+this.id);
      this.userForm.get('contrasena')?.clearValidators();
    } else {
      this.userForm.get('contrasena')?.addValidators(Validators.required);
    }
    this.userForm.get('contrasena')?.updateValueAndValidity();
  }

  loadUser(id: number): void {
    this.isLoading.set(true);
    this.userService.getById(id).subscribe({
      next: (res) => {
        const u = res.data;
        this.userForm.patchValue({
          usuario: u!.usuario, nombre: u!.nombre,
          apellidos: u!.apellidos, sexo: u!.sexo ?? '',
          roles: u!.roles,
        });
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMsg.set('No se pudo cargar el usuario.');
        this.isLoading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) { this.userForm.markAllAsTouched(); return; }
    this.isSaving.set(true);
    const val = this.userForm.getRawValue();

    const obs$ = this.isEditing()
      ? this.userService.replace(+this.id!, {
          usuario: val.usuario!, nombre: val.nombre!,
          apellidos: val.apellidos!, sexo: val.sexo ?? undefined,
          roles: val.roles!,
        })
      : this.userService.create({
          usuario: val.usuario!, contrasena: val.contrasena!,
          nombre: val.nombre!, apellidos: val.apellidos!,
          sexo: val.sexo ?? undefined,
          rol_id: val.rol_id!,   // integer, no array
        });

    obs$.subscribe({
      next: () => this.router.navigate(['/users']),
      error: (err) => {
        this.isSaving.set(false);
        this.errorMsg.set(err?.error?.error?.message ?? 'Error al guardar.');
      },
    });
  }
}
