// src/app/services/candidature/candidature.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CandidatureService {
  private apiUrl = 'http://localhost:9090/api/candidatures/postuler';

  constructor(private http: HttpClient) {}

  postuler(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }
}