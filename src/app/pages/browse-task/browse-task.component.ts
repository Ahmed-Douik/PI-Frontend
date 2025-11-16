// src/app/pages/browse-task/browse-task.component.ts
import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  OnDestroy,
  OnInit   // ← ADD OnInit
} from '@angular/core';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { OffreService } from '../../services/offreService/offre.service';
import { CandidatureService } from '../../services/candidature/candidature.service'; // ← ADD

export interface Offre {
  id: number;
  titre: string;
  description: string;
  prix: number;
  localisationX: number;
  localisationY: number;
  datePrevue: string;
  categorie?: { id: number; nom: string };
  distance?: number;
}

interface Filter {
  category: string;
  maxDistance: number;
  maxPrice: number;
}

@Component({
  selector: 'app-browse-task',
  templateUrl: './browse-task.component.html',
  styleUrls: ['./browse-task.component.css'],
})
export class BrowseTaskComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapContainer') mapContainer!: ElementRef<HTMLDivElement>;

  private map!: L.Map;
  private markers: L.Marker[] = [];

  selectedOffre: Offre | null = null;
  showModal = false;

  proposedPrice: number = 0;
  message: string = '';

  filters: Filter = { category: 'all', maxDistance: 100, maxPrice: 500 };
  searchTerm = '';

  showCategory = false;
  showDistance = false;
  showPrice = false;
  // ADD THESE 4 LINES (anywhere with the other properties)
  alertMessage: string = '';
  alertType: 'success' | 'error' | null = null;
  showAlert: boolean = false;
  alertTimeout: any = null;

  categories: { value: string; label: string }[] = [
    { value: 'all', label: 'Toutes les catégories' }
  ];

  userLocation = { lat: 36.8065, lng: 10.1815 };
  currentUser: any = null; // ← ADD: real user

  allOffres: Offre[] = [];
  offres: Offre[] = [];

  constructor(
    private offreService: OffreService,
    private http: HttpClient,
    private candidatureService: CandidatureService // ← ADD
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.loadOffres();
  }

  ngOnDestroy(): void {
    if (this.map) this.map.remove();
  }

  loadCurrentUser(): void {
    const userJson = localStorage.getItem('currentUser');
    this.currentUser = userJson ? JSON.parse(userJson) : null;
  }

  loadOffres(): void {
    this.offreService.getOffres().subscribe({
      next: (offres: Offre[]) => {
        this.allOffres = offres.map(o => ({ ...o, distance: 0 }));
        this.calculateDistances();
        this.extractCategories();
        this.applyFilters();
      },
      error: () => alert('Erreur: impossible de charger les offres')
    });
  }

  private extractCategories(): void {
    const unique = [...new Set(this.allOffres
      .filter(o => o.categorie?.nom)
      .map(o => o.categorie!.nom!)
    )];
    this.categories = [
      { value: 'all', label: 'Toutes les catégories' },
      ...unique.map(name => ({ value: name, label: name }))
    ];
  }

  // FIX: For category filter button
  getCategoryName(): string {
    if (this.filters.category === 'all') return 'Toutes les catégories';
    const cat = this.categories.find(c => c.value === this.filters.category);
    return cat?.label || 'Toutes les catégories';
  }

  public formatDate(dateStr?: string): string {
    if (!dateStr) return 'Date non définie';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'Date invalide';
    return date.toLocaleDateString('fr-FR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  }

  calculateDistances(): void {
    this.allOffres.forEach(o => {
      o.distance = this.haversine(
        this.userLocation.lat,
        this.userLocation.lng,
        o.localisationX,
        o.localisationY
      );
    });
  }

  private haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  }

  applyFilters(): void {
    this.offres = this.allOffres.filter(o => {
      const cat = this.filters.category === 'all' || o.categorie?.nom === this.filters.category;
      const dist = (o.distance || 0) <= this.filters.maxDistance;
      const price = o.prix <= this.filters.maxPrice;
      const search = !this.searchTerm || o.titre.toLowerCase().includes(this.searchTerm.toLowerCase());
      return cat && dist && price && search;
    });
    this.updateMapMarkers();
  }

  private initMap(): void {
    this.map = L.map(this.mapContainer.nativeElement, {
      center: [36.8, 10.18],
      zoom: 10,
      zoomControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    L.control.zoom({ position: 'topright' }).addTo(this.map);
  }

  private createGlowMarker(lat: number, lng: number): L.Marker {
    const div = L.DomUtil.create('div', 'leaflet-glow-marker');
    L.DomUtil.create('div', 'inner-dot', div);
    const icon = L.divIcon({
      html: div.outerHTML,
      className: '',
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });
    return L.marker([lat, lng], { icon });
  }

  private popupContent(o: Offre): string {
    return `
      <div class="p-2 max-w-xs">
        <b class="block text-sm font-semibold">${o.titre}</b>
        <div class="text-xs text-gray-600 mt-1">${this.formatDate(o.datePrevue)}</div>
        <div class="mt-1 font-bold text-blue-600">${o.prix} DT</div>
        ${o.distance ? `<div class="text-xs text-gray-500">${o.distance} km</div>` : ''}
      </div>`;
  }

  updateMapMarkers(): void {
    this.markers.forEach(m => m.remove());
    this.markers = [];

    this.offres.forEach(o => {
      const m = this.createGlowMarker(o.localisationX, o.localisationY);
      m.bindPopup(this.popupContent(o)).addTo(this.map);
      this.markers.push(m);
    });
  }

  toggleCategory() { this.showCategory = !this.showCategory; this.showDistance = this.showPrice = false; }
  toggleDistance() { this.showDistance = !this.showDistance; this.showCategory = this.showPrice = false; }
  togglePrice() { this.showPrice = !this.showPrice; this.showCategory = this.showDistance = false; }

  selectCategory(cat: string) {
    this.filters.category = cat;
    this.showCategory = false;
    this.applyFilters();
  }

  onDistanceChange() { this.applyFilters(); }
  onPriceChange() { this.applyFilters(); }

  selectOffre(o: Offre): void {
    this.seeMore(o);
    this.map.setView([o.localisationX, o.localisationY], 14);
  }

  seeMore(o: Offre): void {
    this.selectedOffre = o;
    this.showModal = true;
    this.proposedPrice = o.prix;
    this.message = '';
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedOffre = null;
  }

  increasePrice(): void { this.proposedPrice += 10; }
  decreasePrice(): void { if (this.proposedPrice > 10) this.proposedPrice -= 10; }

postuler(): void {
  if (!this.selectedOffre || !this.currentUser) {
    this.showError('Veuillez vous connecter pour postuler');
    return;
  }

  const formData = new FormData();
  formData.append('offreId', this.selectedOffre.id.toString());
  formData.append('utilisateurId', this.currentUser.id.toString());
  formData.append('prixPropose', this.proposedPrice.toString());
  formData.append('message', this.message);

  this.candidatureService.postuler(formData).subscribe({
    next: (res: any) => {
      // res is now { message: "Vous avez postulé avec succès..." }
      this.showSuccess(res?.message || 'Candidature envoyée avec succès !');
    },
    error: (err) => {
      // err.error is also { message: "..." } thanks to the backend change
      const message = err.error?.message || 'Erreur lors de l\'envoi';
      this.showError(message);
    }
  });
}

// NEW: Helper methods — add these inside the class
private showSuccess(message: string): void {
  this.alertMessage = message;
  this.alertType = 'success';
  this.showAlert = true;
  this.closeModalAfterDelay();
}

private showError(message: string): void {
  this.alertMessage = message;
  this.alertType = 'error';
  this.showAlert = true;
  this.closeModalAfterDelay();
}

private closeModalAfterDelay(): void {
  if (this.alertTimeout) clearTimeout(this.alertTimeout);
  this.alertTimeout = setTimeout(() => {
    this.showAlert = false;
    this.closeModal();
  }, 3000);
}
}