import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2'; // Importar SweetAlert2
import { AuthService } from '../../core/services/auth.service';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  selector: 'app-registrar-empleados',
  templateUrl: './registrar-empleados.component.html',
  styleUrls: ['./registrar-empleados.component.css']
})
export default class RegistrarEmpleadosComponent {
  nombreCompleto: string = '';
  username: string = '';
  correo: string = '';
  password: string = '';
  confirmarContrasena: string = '';
  rol: number = 5; // Rol por defecto
  numeroLicencia: string = ''; // Número de licencia por defecto vacío

  constructor(private authService: AuthService) {}

  onRegister(): void {
    console.log('Número de licencia en el registro:', this.numeroLicencia); // Verificar valor aquí
  
    // Verificar si las contraseñas coinciden
    if (this.password !== this.confirmarContrasena) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Las contraseñas no coinciden.',
      });
      return;  // Si las contraseñas no coinciden, detener el proceso de registro
    }
  
    // Si el rol es 5 (chofer), el número de licencia debe ser obligatorio
    if (this.rol === 5 && !this.numeroLicencia) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El número de licencia es obligatorio para choferes.',
      });
      return;
    }

    console.log('Número de licencia en el servicio:', this.numeroLicencia); // Verificar valor al enviarlo al backend
    
    // Llamar al servicio de registro
    this.authService.register(
      this.nombreCompleto,
      this.username,
      this.correo,
      this.password,
      this.confirmarContrasena,
      this.rol,
      this.numeroLicencia || '' // Enviar un string vacío si no hay número de licencia
    ).subscribe({
      next: (response) => {
        console.log('Registro exitoso', response);
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Empleado registrado exitosamente.',
        });
      },
      error: (err) => {
        console.error('Error en el registro', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.message || 'Ocurrió un error al registrar al empleado.',
        });
      }
    });
  }
}
