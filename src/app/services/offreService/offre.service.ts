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
  status: string;
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
    return this.http.get<Offre[]>(`${this.apiUrl}/employer/${userId}/all`);
  }

  //update
  updateOffre(offreId: number, userId: number, dto: FormData): Observable<Offre> {
    return this.http.put<Offre>(`${this.apiUrl}/${offreId}/employer/${userId}`, dto);
  }

  //cancel
  cancelOffre(offreId: number, userId: number) {
    return this.http.put<Offre>(`${this.apiUrl}/${offreId}/cancel/${userId}`,{});
  }

  //delete jemla
  deleteOffre(offreId: number, userId: number) {
    return this.http.delete(`${this.apiUrl}/${offreId}/employer/${userId}`);
  }

  // Add inside OffreService class
      getApplicants(offreId: number, employerId: number): Observable<any[]> {
        return this.http.get<any[]>( `${this.apiUrl}/${offreId}/employer/${employerId}/candidatures` );
      }
    assignCandidature(offreId: number, candidatureId: number, employerId: number): Observable<Offre> {
      return this.http.put<Offre>(
        `${this.apiUrl}/${offreId}/assign/${candidatureId}/employer/${employerId}`,
        {}
      );
    }



}




