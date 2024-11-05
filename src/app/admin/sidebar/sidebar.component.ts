import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // Importar RouterModule
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule], // Incluir RouterModule aquí
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  userName: string;

  constructor(private authService: AuthService) {
    // Obtener el nombre del usuario y loguearlo
    this.userName = this.authService.getUserName();
    console.log("Nombre de usuario:", this.userName);
  }

  logoutAdmin() {
    console.log("Clic en cerrar sesión");
    this.authService.logout();
  }

  isAdmin(): boolean {
    const isAdmin = this.authService.isAdmin();
    console.log("Es admin:", isAdmin);
    return isAdmin;
  }
}
