// users-management/users-management.component.ts
import { Component, OnInit } from '@angular/core';

interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  roles: string[];
  abonnement: string;
  status: string;
}

@Component({
  selector: 'app-users-management',
  templateUrl: './users-management.component.html',
  styleUrls: ['./users-management.component.css']
})
export class UsersManagementComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm: string = '';
  selectedRole: string = 'all';

  constructor() { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    // Mock data - replace with actual service call
    this.users = [
      {
        id: 1,
        nom: 'Doe',
        prenom: 'John',
        email: 'john@example.com',
        roles: ['EMPLOYEE'],
        abonnement: 'Premium',
        status: 'Active'
      }
    ];
    this.filteredUsers = [...this.users];
  }

  filterUsers(): void {
    this.filteredUsers = this.users.filter(user => 
      user.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    if (this.selectedRole !== 'all') {
      this.filteredUsers = this.filteredUsers.filter(user => 
        user.roles.includes(this.selectedRole)
      );
    }
  }

  editUser(user: User): void {
    // Implement edit functionality
  }

  deleteUser(user: User): void {
    if (confirm(`Are you sure you want to delete ${user.prenom} ${user.nom}?`)) {
      // Implement delete functionality
    }
  }

  changeUserRole(user: User, newRole: string): void {
    // Implement role change functionality
  }
}