// src/app/shared/components/dashboard/dashboard.component.ts
import { Component, inject } from '@angular/core';
import { AuthService } from '../../../features/auth/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <div class="dashboard-page">
      <h1>Dashboard</h1>
      @if (user()) {
        <p class="welcome">Bienvenido, <strong>{{ user()!.nombre }} {{ user()!.apellidos }}</strong></p>
      }
      <p class="subtitle">Utiliza el menú lateral para navegar por el sistema.</p>
    </div>
  `,
  styles: [`
    .dashboard-page {
      h1 { margin-bottom: 0.5rem; }
      .welcome {
        font-size: 1.1rem;
        color: #374151;
        margin-bottom: 0.5rem;
        strong { color: #111827; }
      }
      .subtitle {
        color: #6b7280;
        font-size: 0.95rem;
      }
    }
  `]
})
export class DashboardComponent {
  private authService = inject(AuthService);
  readonly user = this.authService.currentUser;
}
