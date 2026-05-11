// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './features/auth/guards/auth.guard';
import { publicGuard } from './features/auth/guards/public.guard';
import { roleGuard } from './features/users/guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  // ─── Rutas públicas (sin sidebar) ────────────────────────────
  {
    path: 'auth',
    canActivate: [publicGuard],
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/components/login/login.component')
            .then(m => m.LoginComponent)
      },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },

  // ─── Rutas autenticadas (con sidebar) ────────────────────────
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./shared/components/layout/layout.component')
        .then(m => m.LayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./shared/components/dashboard/dashboard.component')
            .then(m => m.DashboardComponent)
      },
      {
        path: 'users',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/users/components/user-list/user-list.component')
                .then(m => m.UserListComponent)
          },
          {
            path: 'new',
            canActivate: [roleGuard],
            data: { roles: ['admin'] },
            loadComponent: () =>
              import('./features/users/components/user-form/user-form.component')
                .then(m => m.UserFormComponent)
          },
          {
            path: ':id/edit',
            canActivate: [roleGuard],
            data: { roles: ['admin', 'editor'] },
            loadComponent: () =>
              import('./features/users/components/user-form/user-form.component')
                .then(m => m.UserFormComponent)
          }
        ]
      },
    ]
  },

  // ─── Páginas de error ────────────────────────────────────────
  {
    path: 'forbidden',
    loadComponent: () =>
      import('./shared/components/forbidden/forbidden.component')
        .then(m => m.ForbiddenComponent)
  },
  {
    path: '**',
    loadComponent: () =>
      import('./shared/components/not-found/not-found.component')
        .then(m => m.NotFoundComponent)
  }
];
