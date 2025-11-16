// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface Utilisateur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  description?: string;
  cvPath?: string;
  imgPath?: string;
  roles?: string[];
  abonnementId?: number;
}


export interface LoginRequest {
  email: string;
  motDePasse: string;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:9090/api/auth/login';

  constructor(private http: HttpClient) { }

  login(credentials: LoginRequest): Observable<Utilisateur> {
    return this.http.post<Utilisateur>(this.apiUrl, credentials).pipe(
      tap(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
      })
    );
  }

  // FIXED: Safe parsing
  getCurrentUser(): Utilisateur | null {
    const userJson = localStorage.getItem('currentUser');
    if (!userJson) return null;
    return JSON.parse(userJson) as Utilisateur;
  }

  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null;
  }

  logout(): void {
    localStorage.removeItem('currentUser');
  }

  // ADD THIS METHOD (fixes the second error)
  updateCurrentUser(user: Utilisateur): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }
}