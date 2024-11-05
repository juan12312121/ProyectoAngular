import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule], 
  templateUrl: './login.component.html',
})
export default class LoginComponent {
  usuario: string = '';
  contrasena: string = '';
  errorMessage: string = '';  // Mensaje de error para mostrar en la UI

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.authService.login(this.usuario, this.contrasena).subscribe({
      next: () => {
        console.log('Inicio de sesión exitoso');  // Mensaje de éxito en consola
        this.errorMessage = '';  // Limpiar mensaje de error

        // Redirigir basado en el rol del usuario
        if (this.authService.isAdmin()) {
          console.log('Usuario es administrador, redirigiendo a /admin');
          this.router.navigate(['/admin']); // Redirección a admin
        } else if (this.authService.isUser()) {
          console.log('Usuario es regular, redirigiendo a /usuario');
          this.router.navigate(['/usuario']); // Redirección a usuario
        }
      },
      error: (err) => {
        console.error('Error al iniciar sesión', err);
        this.errorMessage = 'Credenciales incorrectas. Inténtalo de nuevo.';  // Mensaje de error en la UI
        this.usuario = ''; // Limpiar el campo de usuario
        this.contrasena = ''; // Limpiar el campo de contraseña
      },
    });
  }
}
