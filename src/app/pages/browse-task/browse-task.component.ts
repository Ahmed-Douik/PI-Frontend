import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import * as L from 'leaflet';

export interface Task {
  id: number;
  title: string;
  date: string;
  time: string;
  price: string;
  location: { lat: number; lng: number };
  description?: string;
  category: string;
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
export class BrowseTaskComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mapContainer') mapContainer!: ElementRef<HTMLDivElement>;

  private map!: L.Map;
  private markers: L.Marker[] = [];

  selectedTask: Task | null = null;
  showModal = false;

  // Champs ajoutés
  proposedPrice: number = 0;
  message: string = '';

  filters: Filter = {
    category: 'all',
    maxDistance: 100,
    maxPrice: 500,
  };

  searchTerm = '';

  showCategory = false;
  showDistance = false;
  showPrice = false;

  categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'cleaning', label: 'Cleaning' },
    { value: 'gardening', label: 'Gardening' },
    { value: 'delivery', label: 'Delivery' },
    { value: 'plumbing', label: 'Plumbing' },
  ];

  userLocation = { lat: 36.8065, lng: 10.1815 };

  allTasks: Task[] = [
    {
      id: 1,
      title: 'Garden trimming and cleaning',
      date: 'Tue, 7 Oct',
      time: 'Anytime',
      price: '120DT',
      location: { lat: 36.8065, lng: 10.1815 },
      description: 'Need someone to trim hedges...',
      category: 'gardening',
    },
    {
      id: 2,
      title: 'Apartment deep cleaning',
      date: 'Wed, 16 Oct',
      time: '10AM',
      price: '90DT',
      location: { lat: 36.8509, lng: 10.2315 },
      description: '3-bedroom apartment...',
      category: 'cleaning',
    },
    {
      id: 3,
      title: 'Deliver groceries',
      date: 'Fri, 10 Oct',
      time: '5PM',
      price: '20DT',
      location: { lat: 36.8065, lng: 10.1815 },
      description: 'Pick up groceries...',
      category: 'delivery',
    },
    {
      id: 4,
      title: 'Fix a leaking tap',
      date: 'Wed, 17 Oct',
      time: '10AM',
      price: '60DT',
      location: { lat: 36.8509, lng: 10.2315 },
      description: 'Kitchen tap leaking...',
      category: 'plumbing',
    },
  ];

  tasks: Task[] = [];

  ngAfterViewInit(): void {
    this.initMap();
    this.calculateDistances();
    this.applyFilters();
  }

  ngOnDestroy(): void {
    if (this.map) this.map.remove();
  }

  getCategoryLabel(): string {
    const cat = this.categories.find((c) => c.value === this.filters.category);
    return cat ? cat.label : 'Category';
  }

  calculateDistances(): void {
    this.allTasks.forEach((task) => {
      task.distance = this.haversine(
        this.userLocation.lat,
        this.userLocation.lng,
        task.location.lat,
        task.location.lng
      );
    });
  }

  private haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  }

  applyFilters(): void {
    this.tasks = this.allTasks.filter((task) => {
      const catMatch =
        this.filters.category === 'all' || task.category === this.filters.category;

      const distMatch = !task.distance || task.distance <= this.filters.maxDistance;

      const priceMatch =
        !task.price || parseInt(task.price, 10) <= this.filters.maxPrice;

      const titleMatch =
        !this.searchTerm ||
        task.title.toLowerCase().includes(this.searchTerm.toLowerCase());

      return catMatch && distMatch && priceMatch && titleMatch;
    });

    this.updateMapMarkers();
  }

  private initMap(): void {
    this.map = L.map(this.mapContainer.nativeElement, {
      center: [35.8, 9.5],
      zoom: 7,
      zoomControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    L.control.zoom({ position: 'topright' }).addTo(this.map);
  }

  private createGlowMarker(lat: number, lng: number): L.Marker {
    const glowDiv = L.DomUtil.create('div', 'leaflet-glow-marker');
    L.DomUtil.create('div', 'inner-dot', glowDiv);
    const icon = L.divIcon({
      html: glowDiv.outerHTML,
      className: '',
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });
    return L.marker([lat, lng], { icon });
  }

  private popupContent(task: Task): string {
    return `
      <div class="p-2 max-w-xs">
        <b class="block text-sm font-semibold">${task.title}</b>
        <div class="text-xs text-gray-600 mt-1">${task.date} • ${task.time}</div>
        ${task.price ? `<div class="mt-1 font-bold text-blue-600">${task.price}</div>` : ''}
        ${task.distance ? `<div class="text-xs text-gray-500">${task.distance} km away</div>` : ''}
      </div>`;
  }

  updateMapMarkers(): void {
    this.markers.forEach((m) => m.remove());
    this.markers = [];

    this.tasks.forEach((task) => {
      const m = this.createGlowMarker(task.location.lat, task.location.lng);
      m.bindPopup(this.popupContent(task)).addTo(this.map);
      this.markers.push(m);
    });
  }

  toggleCategory() {
    this.showCategory = !this.showCategory;
    this.showDistance = this.showPrice = false;
  }
  toggleDistance() {
    this.showDistance = !this.showDistance;
    this.showCategory = this.showPrice = false;
  }
  togglePrice() {
    this.showPrice = !this.showPrice;
    this.showCategory = this.showDistance = false;
  }

  selectCategory(cat: string) {
    this.filters.category = cat;
    this.showCategory = false;
    this.applyFilters();
  }

  onDistanceChange(): void {
    this.applyFilters();
  }
  onPriceChange(): void {
    this.applyFilters();
  }

  selectTask(task: Task): void {
    const marker = this.markers.find((m) => {
      const pos = m.getLatLng();
      return pos.lat === task.location.lat && pos.lng === task.location.lng;
    });
    if (marker) {
      this.map.setView(marker.getLatLng(), 13);
      marker.openPopup();
    }
  }

  seeMore(task: Task): void {
    this.selectedTask = task;
    this.showModal = true;
    this.proposedPrice = parseInt(task.price, 10) || 0;
    this.message = '';
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedTask = null;
  }

  increasePrice(): void {
    this.proposedPrice += 1;
  }

  decreasePrice(): void {
    if (this.proposedPrice > 0) this.proposedPrice -= 1;
  }

  postuler(): void {
    if (this.selectedTask) {
      alert(
        `Application submitted for: ${this.selectedTask.title}\n` +
        `Proposed Price: ${this.proposedPrice} DT\n` +
        `Message: ${this.message || '(no message)'}`
      );
      this.closeModal();
    }
  }
}
