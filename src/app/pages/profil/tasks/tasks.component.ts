import { Component, OnInit } from '@angular/core';

interface Applicant {
  id: number;
  name: string;
  contact: string;
  email: string;
  proofImage?: string;
}

interface Task {
  id: number;
  title: string;
  date: string;
  time: string;
  price: string;
  location: { lat: number; lng: number };
  description: string;
  category: string;
  status?: 'available' | 'assigned' | 'inProgress' | 'completed' | 'cancelled';
  assignedApplicant?: Applicant;
}

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  allTasks: Task[] = [
    {
      id: 1,
      title: 'Garden trimming and cleaning',
      date: 'Tue, 7 Oct',
      time: 'Anytime',
      price: '120DT',
      location: { lat: 36.8065, lng: 10.1815 },
      description: 'Need someone to trim hedges and clean the garden area.',
      category: 'gardening',
      status: 'available'
    },
    {
      id: 2,
      title: 'Apartment deep cleaning',
      date: 'Wed, 16 Oct',
      time: '10AM',
      price: '90DT',
      location: { lat: 36.8509, lng: 10.2315 },
      description: '3-bedroom apartment needs deep cleaning including kitchen and bathrooms.',
      category: 'cleaning',
      status: 'assigned',
      assignedApplicant: {
        id: 2,
        name: 'Emma Smith',
        contact: '+216 98 123 456',
        email: 'emma@example.com'
      }
    },
    {
      id: 3,
      title: 'Deliver groceries',
      date: 'Fri, 10 Oct',
      time: '5PM',
      price: '20DT',
      location: { lat: 36.8065, lng: 10.1815 },
      description: 'Pick up groceries and deliver to my apartment.',
      category: 'delivery',
      status: 'completed',
      assignedApplicant: {
        id: 1,
        name: 'John Doe',
        contact: '+216 55 999 888',
        email: 'john@example.com',
        proofImage: 'assets/proof.jpg'
      }
    }
  ];

  filteredTasks: Task[] = [];
  selectedStatus = 'all';
  selectedTask: Task | null = null;
  showViewModal = false;
  showEditModal = false;

  // Fake list of applicants
  applicants: Applicant[] = [
    { id: 1, name: 'John Doe', contact: '+216 55 999 888', email: 'john@example.com' },
    { id: 2, name: 'Emma Smith', contact: '+216 98 123 456', email: 'emma@example.com' },
    { id: 3, name: 'Adam Karim', contact: '+216 22 777 555', email: 'adam@example.com' }
  ];

  statusFilters = [
    { label: 'All', value: 'all' },
    { label: 'Available', value: 'available' },
    { label: 'Assigned', value: 'assigned' },
    { label: 'In Progress', value: 'inProgress' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' }
  ];

  ngOnInit(): void {
    this.filteredTasks = [...this.allTasks];
  }

  filterByStatus(status: string): void {
    this.selectedStatus = status;
    this.filteredTasks = status === 'all'
      ? [...this.allTasks]
      : this.allTasks.filter(t => t.status === status);
  }

  getStatusStyle(status?: string): string {
    const styles: { [key: string]: string } = {
      available: 'bg-green-50 text-green-700',
      assigned: 'bg-blue-50 text-blue-700',
      inProgress: 'bg-yellow-50 text-yellow-700',
      completed: 'bg-gray-50 text-gray-700',
      cancelled: 'bg-red-50 text-red-700'
    };
    return styles[status || 'available'] || 'bg-gray-50 text-gray-700';
  }

  viewTask(task: Task): void {
    this.selectedTask = task;
    this.showViewModal = true;
  }

  editTask(task: Task): void {
    this.selectedTask = { ...task };
    this.showEditModal = true;
  }

  deleteTask(task: Task): void {
    if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
      this.allTasks = this.allTasks.filter(t => t.id !== task.id);
      this.filterByStatus(this.selectedStatus);
    }
  }

  cancelTask(task: Task): void {
    if (confirm(`Are you sure you want to cancel "${task.title}"?`)) {
      const index = this.allTasks.findIndex(t => t.id === task.id);
      if (index !== -1) {
        this.allTasks[index].status = 'cancelled';
      }
      this.filterByStatus(this.selectedStatus);
    }
  }

  assignApplicant(applicant: Applicant): void {
    if (this.selectedTask) {
      this.selectedTask.assignedApplicant = applicant;
      this.selectedTask.status = 'assigned';
      this.showViewModal = true;
    }
  }

  saveEditedTask(): void {
    if (this.selectedTask) {
      const index = this.allTasks.findIndex(t => t.id === this.selectedTask!.id);
      if (index !== -1) this.allTasks[index] = { ...this.selectedTask };
      this.showEditModal = false;
      this.filterByStatus(this.selectedStatus);
    }
  }

  closeModal(): void {
    this.showViewModal = false;
    this.showEditModal = false;
  }
}
