import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  nombre_completo: string = ''; // Nombre de usuario inicializado
  isAdminUser: boolean = false; // Estado para saber si el usuario es admin
  token: string | null = ''; // Nueva propiedad para almacenar el token
  decodedToken: any = null; // Variable para almacenar el token decodificado

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    
    this.initializeSidebar();
  }

  private initializeSidebar(): void {
    this.getUserName();
    this.checkIfAdmin();
    this.getToken();
  }

  private getUserName(): void {
    // Obtener el nombre de usuario desde el servicio AuthService
    const user = this.authService.getUserName();
    this.nombre_completo = user ? user : 'Usuario no autenticado'; // En caso de no encontrar usuario
    console.log("Nombre de usuario obtenido del AuthService:", this.nombre_completo);
  }

  private checkIfAdmin(): void {
    // Verificar si el usuario tiene rol de administrador
    this.isAdminUser = this.authService.isAdmin();
    console.log("Es admin:", this.isAdminUser);
  }

  private getToken(): void {
    const token = this.authService.getToken();
    if (token) {
      this.token = token; // Asignar el token
      this.decodeToken(token); // Decodificar el token
    } else {
      this.token = 'No hay token'; // Si no existe el token
      console.log("No hay token disponible");
    }
  }

  private decodeToken(token: string): void {
    try {
      // Decodificar el token
      this.decodedToken = jwtDecode(token);  // Decodificamos usando jwtDecode
      console.log("Token decodificado:", this.decodedToken); // Imprimir el contenido del token

      // Si el nombre completo está presente en el token, lo almacenamos en el localStorage
      if (this.decodedToken && this.decodedToken.nombre_completo) {
        localStorage.setItem('userName', this.decodedToken.nombre_completo); // Guardar nombre completo en localStorage
      }

    } catch (error) {
      console.error("Error al decodificar el token:", error);
    }
  }

  logoutAdmin(): void {
    this.authService.logout();
    this.clearUserData();
    this.router.navigate(['/login']); // Redirección después de logout
  }

  private clearUserData(): void {
    this.nombre_completo = '';  // Limpiar información de usuario al hacer logout
    this.isAdminUser = false; // Limpiar estado de admin
    this.token = ''; // Limpiar token al hacer logout
    this.decodedToken = null; // Limpiar token decodificado
    localStorage.removeItem('userName'); // Limpiar el nombre del usuario en localStorage
  }

  isAdmin(): boolean {
    return this.isAdminUser; // Usamos el valor calculado de `isAdminUser`
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated(); // Verificación de autenticación usando el servicio
  }
  
}
