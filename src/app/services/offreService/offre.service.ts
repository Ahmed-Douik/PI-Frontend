import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
export interface Offre {
  id: number;
  titre: string;
  description: string;
  prix: number;
  localisationX: number;
  localisationY: number;
  datePrevue: string;
  categorie: { id: number; nom: string };
  distance?: number; // calculated
}
@Injectable({
  providedIn: 'root'
})
export class OffreService {
private apiUrl = 'http://localhost:8080/api/offres/disponibles';

  constructor(private http: HttpClient) { }

  getOffres(): Observable<Offre[]> {
    return this.http.get<Offre[]>(this.apiUrl);
  }
}
