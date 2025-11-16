import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css'] // optional if you add extra CSS
})
export class AdminLayoutComponent implements OnInit {
  currentTab = 'dashboard'; // default active tab

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Set active tab based on current URL
    this.updateActiveTab();

    // Update when navigation ends (clicking navbar, back button, etc.)
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateActiveTab();
      });
  }

  private updateActiveTab(): void {
    const url = this.router.url; // e.g. "/admin/users" or "/admin/conflicts"
    const segment = url.split('/').pop() || 'dashboard';

    // List of valid tabs
    const validTabs = ['dashboard', 'users', 'tasks', 'conflicts', 'subscriptions', 'statistics'];
    this.currentTab = validTabs.includes(segment) ? segment : 'dashboard';
  }

  // Called when user clicks a tab in the navbar
  onTabChange(tab: string): void {
    this.currentTab = tab;
    this.router.navigate(['/admin', tab]);
  }
}