import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [FormsModule, CommonModule],
  selector: 'app-sidebar-chofer',
  templateUrl: './sidebar-chofer.component.html',
  styleUrls: ['./sidebar-chofer.component.css'],
})
export class SidebarChoferComponent implements OnInit {
  private tokenKey = 'authToken'; // Clave del token almacenado
  private userRoleKey = 'userRole'; // Clave del rol almacenado
  isSidebarVisible = true; // Estado inicial del sidebar

  constructor(private router: Router) {}

  // Método para cerrar sesión
  logout(): void {
    // Eliminar los datos de autenticación del almacenamiento
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userRoleKey);

    // Redirigir a la página de login después de cerrar sesión
    this.router.navigate(['/login']);
  }

  // Método para alternar la visibilidad del sidebar
  toggleSidebar(): void {
    this.isSidebarVisible = !this.isSidebarVisible;
  }

  // Método que se ejecuta al inicializar el componente
  ngOnInit(): void {
    // Escuchar eventos de navegación y registrar la ruta actual
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        console.log('Navegaste a la ruta:', event.url);
      }
    });
  }

 //Por mis huevos va jalar
  navigateToChofer(): void {
    this.router.navigate(['/chofer']); 
  }

  navigateToAsignaciones(): void {
    this.router.navigate(['/asignaciones']);  
  }
}
