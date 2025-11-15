import { Component, OnInit } from '@angular/core';
import { OffreService , Offre} from '../../../services/offreService/offre.service';
import { Observable } from 'rxjs';

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
  categorieId: number;
  status?: 'available' | 'assigned' | 'inProgress' | 'completed' | 'cancelled';
  assignedApplicant?: Applicant;
}

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  allTasks: Task[] = [];
  filteredTasks: Task[] = [];
  selectedStatus = 'all';
  selectedTask: Task | null = null;
  showViewModal = false;
  showEditModal = false;

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

  constructor(private offreService: OffreService) {}

  ngOnInit(): void {
    this.loadTasksFromBackend();
  }

  private mapStatus(status: String): 'available' | 'assigned' | 'inProgress' | 'completed' | 'cancelled' {
    switch (status) {
      case 'DISPONIBLE': return 'available';
      case 'ATTRIBUE': return 'assigned';
      case 'ENCOURS': return 'inProgress';
      case 'TERMINE': return 'completed';
      case 'ANNULEE': return 'cancelled';
      default: return 'available';
    }
  }


  loadTasksFromBackend(): void {

    const userId = 5; // id
    this.offreService.getOffresByEmployer(userId).subscribe({
      next: (offres: Offre[]) => {

        this.allTasks = offres.map(o => ({
          id: o.id,
          title: o.titre,
          date: new Date(o.datePrevue).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }),
          time: 'Anytime',
          price: o.prix + 'DT',
          location: { lat: o.localisationX, lng: o.localisationY },
          description: o.description,
          category: o.categorie.nom,
          categorieId: o.categorie.id,
          status: this.mapStatus(o.status as String),
        }));
        this.allTasks.sort((a, b) => {
          const order = ['available', 'assigned', 'inProgress', 'completed', 'cancelled'];
          return order.indexOf(a.status!) - order.indexOf(b.status!);
        });

        this.filteredTasks = [...this.allTasks];
      },
      error: (err) => console.error('Erreur chargement tâches :', err)
    });
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

  viewTask(task: Task): void { this.selectedTask = task; this.showViewModal = true; }
  editTask(task: Task): void { this.selectedTask = { ...task }; this.showEditModal = true; }


  deleteTask(task: Task): void {
    const userId = 5; // ton employeur

    if (!confirm(`Are you sure you want to delete the task "${task.title}" ?`)) {
      return;
    }

    this.offreService.deleteOffre(task.id, userId).subscribe({
      next: () => {
        // Supprimer localement
        this.allTasks = this.allTasks.filter(t => t.id !== task.id);
        this.filteredTasks = this.filteredTasks.filter(t => t.id !== task.id);

        console.log("Task deleted");
      },
      error: (err) => {
        console.error("Error deleting task:", err);
      }
    });
  }

  cancelTask(task: Task): void {
    const userId = 5;
    if (!confirm(`Are you sure you want to cancel "${task.title}"?`)) {
      return;
    }

    this.offreService.cancelOffre(task.id, userId).subscribe({
      next: (updated) => {
        const index = this.allTasks.findIndex(t => t.id === task.id);
        if (index !== -1) {
          this.allTasks[index].status = 'cancelled';
        }

        this.filterByStatus(this.selectedStatus);

        this.showViewModal = false;

        console.log('Offer cancelled successfully', updated);
      },
      error: (err) => console.error('Erreur annulation :', err)
    });
  }



  assignApplicant(applicant: Applicant): void {
    if (this.selectedTask) {
      this.selectedTask.assignedApplicant = applicant;
      this.selectedTask.status = 'assigned';
      this.showViewModal = true;
    }
  }
  saveEditedTask(): void {
    if (!this.selectedTask) return;

    const userId = 5; // ton employeur
    const formData = new FormData();

    formData.append('titre', this.selectedTask.title);
    formData.append('description', this.selectedTask.description);
    formData.append('prix', parseFloat(this.selectedTask.price.replace('DT','').trim()).toString());


    formData.append('localisationX', this.selectedTask.location.lat.toString());
    formData.append('localisationY', this.selectedTask.location.lng.toString());


    formData.append('categorieId', (this.selectedTask as any).categorieId.toString());

    formData.append('datePrevue', new Date().toISOString().split('T')[0]); // ici tu peux mettre selectedTask.date si tu l'as en LocalDate



    this.offreService.updateOffre(this.selectedTask.id, userId, formData).subscribe({
      next: (updatedOffre: Offre) => {
        const index = this.allTasks.findIndex(t => t.id === updatedOffre.id);
        if (index !== -1) {
          this.allTasks[index] = {
            ...this.allTasks[index],
            title: updatedOffre.titre,
            description: updatedOffre.description,
            price: updatedOffre.prix + 'DT',
          };
        }
        this.filterByStatus(this.selectedStatus);
        this.showEditModal = false;
      },
      error: (err) => console.error('Erreur lors de la mise à jour :', err)
    });
  }



  closeModal(): void { this.showViewModal = false; this.showEditModal = false; }


}
