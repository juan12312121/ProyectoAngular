import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { SidebarComponent } from '../sidebar/sidebar.component';




@Component({
  standalone: true,
  imports: [CommonModule,FormsModule,SidebarComponent],
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
  rol: number = 10; // Rol por defecto para empleados

  constructor(private authService: AuthService, private router: Router) {}

  onRegister(): void {
    this.authService.register(this.nombreCompleto, this.username, this.correo, this.password, this.confirmarContrasena, this.rol)
      .subscribe({
        next: (response) => {
          console.log('Registro exitoso', response);
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Error en el registro', err);
          alert(err.message);  // Muestra el error si ocurre
        }
      });
  }
}
