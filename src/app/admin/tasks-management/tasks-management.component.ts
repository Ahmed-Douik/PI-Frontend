import { Component } from '@angular/core';

@Component({
  selector: 'app-tasks-management',
  templateUrl: './tasks-management.component.html',
})
export class TasksManagementComponent {
  tasks = [
    { id: 1, titre: 'Garden Maintenance', employer: 'John Doe', status: 'DISPONIBLE', prix: 150, datePrevue: '2024-12-20', candidatures: 5 },
    { id: 2, titre: 'House Cleaning', employer: 'Jane Smith', status: 'ATTRIBUE', prix: 80, datePrevue: '2024-12-18', candidatures: 3 },
    { id: 3, titre: 'Painting Work', employer: 'Mike Johnson', status: 'ENCOURS', prix: 300, datePrevue: '2024-12-15', candidatures: 8 },
  ];

  getStatusClass(status: string) {
    const map: Record<string, string> = {
      DISPONIBLE: 'bg-gray-100 text-gray-800',
      ATTRIBUE: 'bg-yellow-100 text-yellow-800',
      ENCOURS: 'bg-blue-100 text-blue-800',
      TERMINE: 'bg-green-100 text-green-800',
      ANNULEE: 'bg-red-100 text-red-700'
    };
    return map[status] || 'bg-gray-100 text-gray-700';
  }
}