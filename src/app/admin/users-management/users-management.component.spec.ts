import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users-management.component.html',
})
export class UsersManagementComponent {
  users = [
    { id: 1, prenom: 'John', nom: 'Doe', email: 'john.doe@example.com', roles: ['EMPLOYER'], abonnement: 'Premium', status: 'Active' },
    { id: 2, prenom: 'Jane', nom: 'Smith', email: 'jane.smith@example.com', roles: ['EMPLOYEE'], abonnement: 'Basic', status: 'Active' },
    { id: 3, prenom: 'Mike', nom: 'Johnson', email: 'mike.j@example.com', roles: ['EMPLOYER', 'EMPLOYEE'], abonnement: 'Pro', status: 'Inactive' },
  ];
}