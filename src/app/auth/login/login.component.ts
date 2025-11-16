// src/app/login/login.component.ts
import { Component } from '@angular/core';
import { AuthService } from '../../services/Auth/auth-service.service';
import { Router } from '@angular/router';


// src/app/models/login-request.model.ts
export interface LoginRequest {
  email: string;
  motDePasse: string;
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials: LoginRequest = { email: '', motDePasse: '' };
  errorMessage: string = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (!this.credentials.email || !this.credentials.motDePasse) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.credentials).subscribe({
      next: (user) => {
        console.log('Login successful:', user);
        this.router.navigate(['/profil']);
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 401) {
          this.errorMessage = 'Email ou mot de passe incorrect';
        } else {
          this.errorMessage = 'Erreur de connexion. Réessayez.';
        }
      }
    });
  }
}