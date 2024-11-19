import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
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
    // Intentamos iniciar sesión utilizando el servicio de autenticación
    this.authService.login(this.usuario, this.contrasena).subscribe({
      next: (response) => {
        console.log('Inicio de sesión exitoso');
        this.errorMessage = '';  // Limpiar mensaje de error en caso de éxito

        const token = response.token;  // Obtenemos el token de la respuesta

        if (token) {
          try {
            // Decodificamos el token JWT
            const decodedToken: any = jwtDecode(token);
            console.log('Decoded token:', decodedToken);  // Imprimimos el contenido del token decodificado

            // Verificamos si el token contiene el campo id (ID de usuario)
            if (decodedToken && decodedToken.id) {
              // Establecemos el userId en el servicio de autenticación
              this.authService.setUserId(decodedToken.id);  // Usamos 'id' en lugar de 'userId'

              // Mostramos el ID del usuario logueado en un log
              console.log('ID del usuario logueado:', decodedToken.id);
            } else {
              this.errorMessage = 'Token no contiene un ID de usuario válido';
              console.error('Token no contiene un ID de usuario válido', decodedToken);
              return;
            }
          } catch (error) {
            this.errorMessage = 'Error al decodificar el token';
            console.error('Error al decodificar el token', error);
            return;
          }
        } else {
          this.errorMessage = 'Token no encontrado';
          console.error('Token no encontrado en la respuesta');
          return;
        }

        // Redirigimos según el rol del usuario
        if (this.authService.isAdmin()) {
          console.log('Usuario es administrador, redirigiendo a /admin');
          this.router.navigate(['/admin']);  // Redirección a admin
        } else if (this.authService.isUser()) {
          console.log('Usuario es regular, redirigiendo a /usuario');
          this.router.navigate(['/usuario']);  // Redirección a usuario
        }
      },
      error: (err) => {
        console.error('Error al iniciar sesión', err);
        this.errorMessage = 'Credenciales incorrectas. Inténtalo de nuevo.';  // Mensaje de error en la UI
        this.usuario = '';  // Limpiar el campo de usuario
        this.contrasena = '';  // Limpiar el campo de contraseña
      },
    });
  }
}
