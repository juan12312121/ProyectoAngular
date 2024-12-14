import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './registro.component.html',
})
export default class RegistroComponent {
  nombre: string = '';
  nickname: string = '';  // Cambio de 'usuario' a 'nickname'
  email: string = '';
  contrasena: string = '';
  confirmarContrasena: string = '';
  rol: number = 1; // Default role is user (1)

  passwordVisible: boolean = false;  // Estado para visibilidad de la contraseña
  confirmPasswordVisible: boolean = false;  // Estado para visibilidad de la contraseña de confirmación

  constructor(private authService: AuthService, private router: Router) {}

  // Función para alternar la visibilidad de la contraseña
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  // Función para alternar la visibilidad de la contraseña de confirmación
  toggleConfirmPasswordVisibility(): void {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  register(): void {
    console.log('Iniciando registro');

    // Validación de contraseñas
    if (this.contrasena !== this.confirmarContrasena) {
      console.error('Las contraseñas no coinciden');
      return;
    }

    console.log('Enviando datos al servicio:', {
      nickname: this.nickname,
      email: this.email,
      contrasena: this.contrasena,
      rol: this.rol // Include role in the registration
    });

    // Asegúrate de pasar 'this.confirmarContrasena' también
    this.authService.register(this.nombre, this.nickname, this.email, this.contrasena, this.confirmarContrasena, this.rol).subscribe({
      next: () => {
        console.log('Registro exitoso');
        this.router.navigate(['/login']);
      },
      error: (err) => console.error('Error al registrarse:', err),
    });
  }
}
