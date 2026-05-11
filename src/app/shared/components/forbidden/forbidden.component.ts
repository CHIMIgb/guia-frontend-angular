// src/app/shared/components/forbidden/forbidden.component.ts
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [RouterLink],
  template: `
    <h1>403 — Acceso Denegado</h1>
    <p>No tienes permisos para acceder a esta sección.</p>
    <a routerLink="/dashboard">Volver al Dashboard</a>
  `,
})
export class ForbiddenComponent {}
