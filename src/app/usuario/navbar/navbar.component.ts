import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Importar Router
import Swal from 'sweetalert2'; // Importar SweetAlert2
import { AuthService } from '../../core/services/auth.service'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'] // Corrige el nombre a styleUrls
})
export class NavbarComponent {
  isProfileDropdownOpen = false;
  isNotificationDropdownOpen = false;
  notifications: string[] = [];
  isLoggedIn = false; // Cambia esto según el estado de la sesión del usuario

  constructor(private authService: AuthService, private router: Router) {} // Inyectar Router

  toggleProfileDropdown() {
    this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
    this.isNotificationDropdownOpen = false; // Cierra notificaciones si están abiertas
  }

  toggleNotificationDropdown() {
    this.isNotificationDropdownOpen = !this.isNotificationDropdownOpen;
    this.isProfileDropdownOpen = false; // Cierra el perfil si está abierto
  }

  logout() {
    this.authService.logout(); // Usa AuthService para manejar el cierre de sesión
    console.log('Usuario cerrado sesión');
    this.isLoggedIn = false; // Actualiza el estado

    // Mostrar alerta de cierre de sesión exitoso
    Swal.fire({
      icon: 'success',
      title: 'Cierre de sesión exitoso',
      text: 'Has cerrado sesión correctamente.',
      confirmButtonText: 'Aceptar'
    }).then(() => {
      // Redirigir a la página de usuario después de que se cierre la alerta
      this.router.navigate(['/usuario']); // Ajusta la ruta según sea necesario
    });
  }

  // Agregar un método para comprobar el estado de inicio de sesión
  checkLoginStatus() {
    this.isLoggedIn = this.authService.isLoggedIn(); // Método que debes definir en AuthService
  }

  ngOnInit() {
    this.checkLoginStatus(); // Comprueba el estado de inicio de sesión al cargar el componente
    this.loadNotifications(); // Cargar notificaciones si las hay
  }

  loadNotifications() {
    // Aquí puedes cargar notificaciones desde el servicio o API
    this.notifications = ['Notificación 1', 'Notificación 2', 'Notificación 3']; // Datos de prueba
  }
}
