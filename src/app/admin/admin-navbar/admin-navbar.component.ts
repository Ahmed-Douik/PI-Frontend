import { Component, Input, Output, EventEmitter } from '@angular/core';

interface MenuItem {
  id: string;
  label: string;
  icon: string; // icon name
  path: string;
}

@Component({
  selector: 'app-admin-navbar',
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.css']
})
export class AdminNavbarComponent {
  @Input() isHovered = false;                // Receive hover state from parent
  @Output() hoverChange = new EventEmitter<boolean>();  // Emit hover changes to parent

  activeItem = 'dashboard';

  menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'grid', path: '/admin/admin-dashboard' },
    { id: 'conflicts', label: 'Conflicts Management', icon: 'git-merge', path: '/admin/conflicts-management' },
    { id: 'statistics', label: 'Statistics', icon: 'bar-chart-2', path: '/admin/statistics' },
    { id: 'subscriptions', label: 'Subscriptions', icon: 'credit-card', path: '/admin/subscriptions-management' },
    { id: 'tasks', label: 'Tasks Management', icon: 'check-square', path: '/admin/tasks-management' },
    { id: 'users', label: 'Users Management', icon: 'users', path: '/admin/users-management' },
    { id: 'payment', label: 'Payment Management', icon: 'dollar-sign', path: '/admin/payment-management' },
  ];

  setActive(id: string) {
    this.activeItem = id;
  }

  onMouseEnter() {
    this.isHovered = true;
    this.hoverChange.emit(true);
  }

  onMouseLeave() {
    this.isHovered = false;
    this.hoverChange.emit(false);
  }
}
