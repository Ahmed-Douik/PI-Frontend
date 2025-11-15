import { Component, OnInit } from '@angular/core';
import { UtilisateurService, Utilisateur } from '../../../services/utilisateur/utilisateur.service';

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

  constructor(private utilisateurService: UtilisateurService) {}

  ngOnInit() {
    this.loadUser();
  }

  loadUser() {
    const userId = 5; // remplacer par l'ID réel ou depuis le token
    this.utilisateurService.getUtilisateurById(userId).subscribe({
      next: (data) => {
        this.user = data;
        this.profileImage = data.imgPath || null;
        this.cvFileName = data.cvPath || null;
      },
      error: (err) => console.error('Erreur lors du chargement de l’utilisateur :', err)
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
    if (!this.user) return;
    const updatedUser: Utilisateur = { ...this.user }; // copie complète
    this.utilisateurService.updateUtilisateur(this.user.id, updatedUser)

      .subscribe({
        next: (updated) => {
          this.user = updated;
          alert('Description saved successfully!');
        },
        error: (err) => console.error('Erreur lors de la sauvegarde :', err)
      });
  }

  getInitials(author: string): string {
    const names = author.split(' ').filter(n => n);
    if (names.length === 0) return '';
    if (names.length === 1) return names[0][0].toUpperCase();
    return (names[0][0] + names[1][0]).toUpperCase();
  }
}
