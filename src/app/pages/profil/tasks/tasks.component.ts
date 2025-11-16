import { Component, OnInit } from '@angular/core';
import { OffreService, Offre } from '../../../services/offreService/offre.service';
import { Observable } from 'rxjs';

interface Applicant {
  id: number;                    // ← THIS WILL NOW BE THE CANDIDATURE ID
  name: string;
  contact: string;
  email: string;
  prixPropose?: number;
  message?: string;
  dateCandidature?: string;
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
  applicants: Applicant[] = [];
  loadingApplicants = false;

  statusFilters = [
    { label: 'All', value: 'all' },
    { label: 'Available', value: 'available' },
    { label: 'Assigned', value: 'assigned' },
    { label: 'In Progress', value: 'inProgress' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' }
  ];

  private currentUserId: number;

  constructor(private offreService: OffreService) {
    const userJson = localStorage.getItem('currentUser');
    this.currentUserId = userJson ? JSON.parse(userJson).id : 0;

    if (!this.currentUserId) {
      console.error('No user logged in!');
    }
  }

  ngOnInit(): void {
    this.loadTasksFromBackend();
  }

  private mapStatus(status: string): 'available' | 'assigned' | 'inProgress' | 'completed' | 'cancelled' {
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
    if (!this.currentUserId) return;

    this.offreService.getOffresByEmployer(this.currentUserId).subscribe({
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
          status: this.mapStatus(o.status as string),
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

  viewTask(task: Task): void {
    this.selectedTask = task;
    this.showViewModal = true;
    this.applicants = [];
    this.loadingApplicants = true;

    if (task.status === 'available' && this.currentUserId) {
      this.offreService.getApplicants(task.id, this.currentUserId).subscribe({
        next: (candidatures) => {
          this.applicants = candidatures.map(c => ({
            id: c.id,                                            // ← CANDIDATURE ID (fixed!)
            name: c.utilisateur.nom + ' ' + c.utilisateur.prenom,
            contact: c.utilisateur.telephone || '+216 XX XXX XXX',
            email: c.utilisateur.email,
            prixPropose: c.prixPropose,
            message: c.message,
            dateCandidature: c.dateCandidature
          }));
          this.loadingApplicants = false;
        },
        error: (err) => {
          console.error('Erreur chargement candidats:', err);
          this.applicants = [];
          this.loadingApplicants = false;
        }
      });
    } else {
      this.loadingApplicants = false;
    }
  }

  assignApplicant(applicant: Applicant): void {
  if (!this.selectedTask || !this.currentUserId) return;

  const candidatureId = applicant.id;

  if (!confirm(`Attribuer cette tâche à ${applicant.name} pour ${applicant.prixPropose} DT ?`)) {
    return;
  }

  this.offreService.assignCandidature(this.selectedTask.id, candidatureId, this.currentUserId)
    .subscribe({
      next: (updatedOffre) => {
        // Update task in list
        const taskIndex = this.allTasks.findIndex(t => t.id === this.selectedTask!.id);
        if (taskIndex !== -1) {
          this.allTasks[taskIndex].status = 'assigned';
          this.allTasks[taskIndex].price = updatedOffre.prix + ' DT';
          // Save the assigned worker
          this.allTasks[taskIndex].assignedApplicant = { ...applicant };
        }

        // Update current modal task
        this.selectedTask!.status = 'assigned';
        this.selectedTask!.price = updatedOffre.prix + ' DT';
        this.selectedTask!.assignedApplicant = { ...applicant }; // ← THIS IS KEY!

        // Clear applicants list (others deleted)
        this.applicants = [];

        alert(`${applicant.name} a été assigné avec succès ! Prix final: ${updatedOffre.prix} DT`);
      },
      error: (err) => {
        alert(err.error || 'Erreur lors de l\'attribution');
      }
    });
}

  editTask(task: Task): void { this.selectedTask = { ...task }; this.showEditModal = true; }

  deleteTask(task: Task): void {
    if (!this.currentUserId) return;

    if (!confirm(`Are you sure you want to delete the task "${task.title}" ?`)) {
      return;
    }

    this.offreService.deleteOffre(task.id, this.currentUserId).subscribe({
      next: () => {
        this.allTasks = this.allTasks.filter(t => t.id !== task.id);
        this.filteredTasks = this.filteredTasks.filter(t => t.id !== task.id);
        console.log("Task deleted");
      },
      error: (err) => console.error("Error deleting task:", err)
    });
  }

  cancelTask(task: Task): void {
    if (!this.currentUserId) return;

    if (!confirm(`Are you sure you want to cancel "${task.title}"?`)) {
      return;
    }

    this.offreService.cancelOffre(task.id, this.currentUserId).subscribe({
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

  saveEditedTask(): void {
    if (!this.selectedTask || !this.currentUserId) return;

    const formData = new FormData();
    formData.append('titre', this.selectedTask.title);
    formData.append('description', this.selectedTask.description);
    formData.append('prix', parseFloat(this.selectedTask.price.replace('DT','').trim()).toString());
    formData.append('localisationX', this.selectedTask.location.lat.toString());
    formData.append('localisationY', this.selectedTask.location.lng.toString());
    formData.append('categorieId', (this.selectedTask as any).categorieId.toString());
    formData.append('datePrevue', new Date().toISOString().split('T')[0]);

    this.offreService.updateOffre(this.selectedTask.id, this.currentUserId, formData).subscribe({
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