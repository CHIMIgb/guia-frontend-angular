// src/app/features/auth/components/login/login.component.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private fb          = inject(FormBuilder);
  private authService = inject(AuthService);
  private router      = inject(Router);
  private route       = inject(ActivatedRoute);

  readonly isLoading = signal(false);
  readonly errorMsg  = signal<string | null>(null);

  loginForm = this.fb.group({
    usuario:   ['', [Validators.required, Validators.minLength(3)]],
    contrasena: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMsg.set(null);

    const credentials = this.loginForm.getRawValue() as {
      usuario: string;
      contrasena: string;
    };

    this.authService.login(credentials).subscribe({
      next: () => {
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
        this.router.navigateByUrl(returnUrl);
      },
      error: (err) => {
        this.isLoading.set(false);
        const msg = err?.error?.error?.message ?? 'Error al iniciar sesión.';
        this.errorMsg.set(msg);
      },
      complete: () => this.isLoading.set(false),
    });
  }

  get usuarioCtrl()   { return this.loginForm.get('usuario')!; }
  get contrasenaCtrl(){ return this.loginForm.get('contrasena')!; }
}
