import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  showPassword = false;
  loading = signal(false);
  error = signal('');
  year = new Date().getFullYear();

  private auth = inject(AuthService);
  private router = inject(Router);

  constructor() {
    if (this.auth.getToken()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onLogin() {
    if (!this.email || !this.password) {
      this.error.set('Please enter your email and password.');
      return;
    }
    this.loading.set(true);
    this.error.set('');

    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading.set(false);
        if (err?.status === 401) {
          this.error.set('Invalid email or password. Please try again.');
        } else {
          this.error.set('Backend is unavailable. Use Demo Mode to explore the dashboard.');
        }
      }
    });
  }

  loginDemo() {
    this.auth.loginDemo();
  }
}
