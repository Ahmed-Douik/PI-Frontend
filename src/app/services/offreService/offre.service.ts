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
  private apiUrl = 'http://localhost:9090/api/offres';

  constructor(private http: HttpClient) { }

  getOffres(): Observable<Offre[]> {
    return this.http.get<Offre[]>(this.apiUrl+"/disponibles");
  }

  //get par employeur
  getOffresByEmployer(userId: number): Observable<Offre[]> {
    return this.http.get<Offre[]>(`${this.apiUrl}/employer/${userId}`);
  }

  //update
  updateOffre(offreId: number, userId: number, dto: FormData): Observable<Offre> {
    return this.http.put<Offre>(`${this.apiUrl}/${offreId}/employer/${userId}`, dto);
  }

}




