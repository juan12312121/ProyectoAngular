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
  rol: number = 5; 

  constructor(private authService: AuthService) {}

  onRegister(): void {
    // Verificar si el rol es 1 (Empleado), lo cual no está permitido
    if (this.rol === 1) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se puede registrar con el rol de empleado (Nivel 1).',
      });
      return;
    }

    // Verificar si las contraseñas coinciden
    if (this.password !== this.confirmarContrasena) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Las contraseñas no coinciden.',
      });
      return;
    }

    // Llamar al servicio para registrar el empleado
    this.authService.register(this.nombreCompleto, this.username, this.correo, this.password, this.confirmarContrasena, this.rol)
      .subscribe({
        next: (response) => {
          console.log('Registro exitoso', response);
          
          // Mostrar mensaje de éxito con SweetAlert
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Empleado registrado exitosamente.',
          });
        },
        error: (err) => {
          console.error('Error en el registro', err);
          
          // Mostrar mensaje de error con SweetAlert
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err.message || 'Ocurrió un error al registrar al empleado.',
          });
        }
      });
  }
}
