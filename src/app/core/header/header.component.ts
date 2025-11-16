import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  currentUser: any = null;
  dropdownOpen = false;
  hideHeaderFooter = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.checkUserLogin();
    
    // Re-check user on every navigation (in case login/logout happens)
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkUserLogin();
        this.hideHeaderFooter = this.router.url.includes('/profil');
      });
  }

  checkUserLogin() {
    const userJson = localStorage.getItem('currentUser');
    this.currentUser = userJson ? JSON.parse(userJson) : null;
  }

  getInitials(): string {
    if (!this.currentUser) return '?';
    const nom = this.currentUser.nom || '';
    const prenom = this.currentUser.prenom || '';
    return (prenom[0] || '') + (nom[0] || '');
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUser = null;
    this.dropdownOpen = false;
    this.router.navigate(['/home']);
  }

  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.relative')) {
      this.dropdownOpen = false;
    }
  }
}