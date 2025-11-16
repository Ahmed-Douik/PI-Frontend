// conflicts-management.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-conflicts-management',
  templateUrl: './conflicts-management.component.html',
})
export class ConflictsManagementComponent {
  conflicts = [
    { id: 1, task: 'Garden Maintenance', employer: 'John Doe', employee: 'Mark Wilson', reason: 'Work not completed', priority: 'High', date: '2024-12-10' },
    { id: 2, task: 'House Cleaning', employer: 'Jane Smith', employee: 'Sarah Lee', reason: 'Quality dispute', priority: 'Medium', date: '2024-12-12' },
  ];
}