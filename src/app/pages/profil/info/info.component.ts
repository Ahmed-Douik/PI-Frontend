import { Component } from '@angular/core';

interface User {
  firstName: string;
  lastName: string;
  email: string;
  description?: string;
  rating: number;
}

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
export class InfoComponent {
  user: User = {
    firstName: 'Ahmed',
    lastName: 'Douik',
    email: 'a.douik456@gmail.com',
    description: 'Web Developer | Java Full Stack | Passionate IT Student (ISET Rades)',
    rating: 4 // note fictive
  };

  profileImage: string | ArrayBuffer | null = null;
  cvFileName: string | null = null;

  comments: Comment[] = [
    { author: 'Ghassen Boukhris', text: 'Great work!', rating: 5 },
    { author: 'Islem Gharsallah', text: 'Professional and serious.', rating: 4 },
    { author: 'Adem Attar', text: 'Good communication.', rating: 3 }
  ];

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

  changePassword() {
    alert('Redirecting to change password page.');
  }

  saveDescription() {
    alert('Description saved successfully!');
  }

  getInitials(author: string): string {
    const names = author.split(' ').filter(n => n);
    if (names.length === 0) return '';
    if (names.length === 1) return names[0][0].toUpperCase();
    return (names[0][0] + names[1][0]).toUpperCase();
  }
}
