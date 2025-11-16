import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as L from 'leaflet';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements AfterViewInit {
  @ViewChild('mapContainer') mapContainer!: ElementRef;

  isHovered = false; // Navbar hover state

  ngAfterViewInit(): void {
    this.initTunisiaMap();
  }

  // Called by navbar hover changes
  setSidebarHovered(value: boolean) {
    this.isHovered = value;
  }

  private initTunisiaMap(): void {
    const map = L.map(this.mapContainer.nativeElement).setView([33.8, 9.5], 6.5);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap contributors © CARTO'
    }).addTo(map);

    const tunisiaUsers = [
      { city: 'Tunis', lat: 36.8065, lng: 10.1815, users: 48500, color: '#ef4444' },
      { city: 'Sfax', lat: 34.7406, lng: 10.7600, users: 31200, color: '#f59e0b' },
      { city: 'Sousse', lat: 35.8256, lng: 10.6369, users: 27800, color: '#3b82f6' },
      { city: 'Kairouan', lat: 35.6781, lng: 10.0963, users: 18900, color: '#8b5cf6' },
      { city: 'Bizerte', lat: 37.2744, lng: 9.8739, users: 15200, color: '#10b981' },
      { city: 'Gabès', lat: 33.8815, lng: 10.0982, users: 13800, color: '#f97316' },
      { city: 'Ariana', lat: 36.8625, lng: 10.1956, users: 22100, color: '#ec4899' },
      { city: 'Gafsa', lat: 34.4250, lng: 8.7842, users: 9500, color: '#6366f1' },
    ];

    tunisiaUsers.forEach(loc => {
      const radius = Math.max(15, Math.min(45, loc.users / 1000));
      L.circleMarker([loc.lat, loc.lng], {
        radius: radius,
        fillColor: loc.color,
        color: '#fff',
        weight: 3,
        opacity: 1,
        fillOpacity: 0.85
      })
      .bindTooltip(`${loc.city}<br>${loc.users.toLocaleString()} users`, {
        permanent: false,
        direction: 'top'
      })
      .addTo(map);
    });
  }
}
