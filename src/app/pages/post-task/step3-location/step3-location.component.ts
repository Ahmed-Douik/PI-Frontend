import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import * as L from 'leaflet';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'leaflet/marker-icon-2x.png',
  iconUrl: 'leaflet/marker-icon.png',
  shadowUrl: 'leaflet/marker-shadow.png',
});

@Component({
  selector: 'app-step3-location',
  templateUrl: './step3-location.component.html',
  styleUrls: ['./step3-location.component.css']
})
export class Step3LocationComponent implements AfterViewInit, OnDestroy {
  private map!: L.Map;
  private marker!: L.Marker;
  locationInput = '';
  private debounceTimer: any;

  ngAfterViewInit(): void {
    this.map = L.map('map').setView([36.8065, 10.1815], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.marker = L.marker([36.8065, 10.1815], { draggable: true }).addTo(this.map);

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      this.marker.setLatLng([lat, lng]);
      this.locationInput = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    });

    this.marker.on('dragend', () => {
      const pos = this.marker.getLatLng();
      this.locationInput = `${pos.lat.toFixed(5)}, ${pos.lng.toFixed(5)}`;
    });

    setTimeout(() => {
      this.map.invalidateSize();
    }, 200);
  }

  onAddressInputChange(): void {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.searchAddress();
    }, 300);
  }

  async searchAddress() {
    if (!this.locationInput.trim()) return;

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(this.locationInput)}&countrycodes=tn&limit=1`;
    try {
      const response = await fetch(url);
      const results = await response.json();

      if (results && results.length > 0) {
        const { lat, lon } = results[0];
        const newLat = parseFloat(lat);
        const newLon = parseFloat(lon);
        this.map.setView([newLat, newLon], 14);
        this.marker.setLatLng([newLat, newLon]);
      }
    } catch (error) {
      console.error('Erreur géocodage:', error);
    }
  }

  onSubmit(): void {
    alert('Location submitted: ' + this.locationInput);
  }

  ngOnDestroy(): void {
    if (this.map) this.map.remove();
  }
}
