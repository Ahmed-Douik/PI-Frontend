import { Component, OnInit } from '@angular/core';
import { UtilisateurService, Utilisateur } from '../../../services/utilisateur/utilisateur.service';
import { AuthService } from '../../../services/Auth/auth-service.service'; // <-- ADD THIS

interface Comment {
  author: string;
  text: string;
  rating: number;
}

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {
  user: Utilisateur = {
    id: 0,
    nom: '',
    prenom: '',
    email: '',
    description: '',
    cvPath: '',
    imgPath: ''
  };

  profileImage: string | ArrayBuffer | null = null;
  cvFileName: string | null = null;

  comments: Comment[] = [
    { author: 'Ghassen Boukhris', text: 'Great work!', rating: 5 },
    { author: 'Islem Gharsallah', text: 'Professional and serious.', rating: 4 },
    { author: 'Adem Attar', text: 'Good communication.', rating: 3 }
  ];

  constructor(
    private utilisateurService: UtilisateurService,
    private authService: AuthService  // <-- Inject AuthService
  ) {}

  ngOnInit() {
    this.loadCurrentUser();
  }

  loadCurrentUser() {
  const currentUser = this.authService.getCurrentUser();

  if (!currentUser || !currentUser.id) {
    console.error('No user logged in or ID missing');
    return;
  }

  const userId = currentUser.id;

  this.utilisateurService.getUtilisateurById(userId).subscribe({
    next: (data) => {
      this.user = data;

      // FIXED LINE 1 – imgPath
      this.profileImage = data.imgPath || 'assets/default-avatar.png';

      // FIXED LINE 2 – cvPath (eliminates undefined)
      this.cvFileName = data.cvPath 
        ? data.cvPath.split('/').pop() ?? null   // ?? null converts undefined → null
        : null;
    },
    error: (err) => {
      console.error('Erreur lors du chargement du profil :', err);
      alert('Impossible de charger votre profil');
    }
  });
}

  uploadProfileImage(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => this.profileImage = reader.result;
      reader.readAsDataURL(file);
    }
  }

  uploadCV(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.cvFileName = input.files[0].name;
    }
  }

  saveDescription() {
    if (!this.user?.id) {
      alert('Utilisateur non chargé');
      return;
    }

    this.utilisateurService.updateUtilisateur(this.user.id, this.user).subscribe({
      next: (updated) => {
        this.user = updated;
        // Update localStorage too so it stays in sync
        this.authService.updateCurrentUser(updated);
        alert('Description sauvegardée avec succès !');
      },
      error: (err) => {
        console.error('Erreur sauvegarde:', err);
        alert('Erreur lors de la sauvegarde');
      }
    });
  }

  getInitials(author: string): string {
    const names = author.split(' ').filter(n => n);
    if (names.length === 0) return '';
    if (names.length === 1) return names[0][0].toUpperCase();
    return (names[0][0] + names[1][0]).toUpperCase();
  }
}