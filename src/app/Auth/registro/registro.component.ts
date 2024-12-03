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
  usuario: string = '';
  email: string = '';
  contrasena: string = '';
  confirmarContrasena: string = '';
  rol: number = 1; // Default role is user (1)

  constructor(private authService: AuthService, private router: Router) {}

  register(): void {
    console.log('Iniciando registro');

    if (this.contrasena !== this.confirmarContrasena) {
      console.error('Las contraseñas no coinciden');
      return;
    }

    console.log('Enviando datos al servicio:', {
      usuario: this.usuario,
      contrasena: this.contrasena,
      rol: this.rol // Include role in the registration
    });

    // Asegúrate de pasar 'this.confirmarContrasena' también
    this.authService.register(this.nombre, this.usuario, this.email, this.contrasena, this.confirmarContrasena, this.rol).subscribe({
      next: () => {
        console.log('Registro exitoso');
        this.router.navigate(['/login']);
      },
      error: (err) => console.error('Error al registrarse:', err),
    });
  }
}
