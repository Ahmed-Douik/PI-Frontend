// subscriptions-management.component.ts
import { Component } from '@angular/core';


@Component({
  selector: 'app-subscriptions-management',
  templateUrl: './subscriptions-management.component.html',
})
export class SubscriptionsManagementComponent {
  subscriptions = [
    { id: 1, libelle: 'Basic', prix: 9.99, activeUsers: 320, imgPath: '3rd' },
    { id: 2, libelle: 'Pro', prix: 19.99, activeUsers: 256, imgPath: '2nd' },
    { id: 3, libelle: 'Premium', prix: 29.99, activeUsers: 180, imgPath: '1st' },
  ];
}