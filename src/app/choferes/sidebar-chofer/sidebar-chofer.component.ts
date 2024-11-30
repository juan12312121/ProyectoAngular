import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-sidebar-chofer',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './sidebar-chofer.component.html',
  styleUrls: ['./sidebar-chofer.component.css']
})
export class SidebarChoferComponent {
  private tokenKey = 'authToken'; // Clave del token almacenado
  private userRoleKey = 'userRole'; // Clave del rol almacenado

  constructor(private router: Router) {}

  // Método para cerrar sesión
  logout(): void {
    // Eliminar los datos de autenticación del almacenamiento
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userRoleKey);

    // Redirigir a la página de login después de cerrar sesión
    this.router.navigate(['/login']);
  }
}
