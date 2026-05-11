// src/app/shared/components/not-found/not-found.component.ts
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <h1>404 — Página no encontrada</h1>
    <p>La ruta que buscas no existe.</p>
    <a routerLink="/dashboard">Volver al Dashboard</a>
  `,
})
export class NotFoundComponent {}
