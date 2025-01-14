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
  nickname: string = '';  
  email: string = '';
  contrasena: string = '';
  confirmarContrasena: string = '';
  rol: number = 1; 
  numeroLicencia?: string = ''; // ✅ Agregado para corregir el error

  passwordVisible: boolean = false;  
  confirmPasswordVisible: boolean = false;  

  constructor(private authService: AuthService, private router: Router) {}

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  toggleConfirmPasswordVisibility(): void {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

 register(): void {
    console.log('Iniciando registro');

    if (this.contrasena !== this.confirmarContrasena) {
      console.error('Las contraseñas no coinciden');
      return;
    }

    // ✅ Se utiliza la propiedad correctamente definida
    const numeroLicencia = this.rol === 5 ? this.numeroLicencia : undefined;

    console.log('Enviando datos al servicio:', {
      nickname: this.nickname,
      email: this.email,
      contrasena: this.contrasena,
      rol: this.rol,
      numeroLicencia: numeroLicencia
    });

    this.authService.register(
      this.nombre,
      this.nickname,
      this.email,
      this.contrasena,
      this.confirmarContrasena,
      this.rol,
      numeroLicencia
    ).subscribe({
      next: () => {
        console.log('Registro exitoso');
        this.router.navigate(['/login']);
      },
      error: (err) => console.error('Error al registrarse:', err),
    });
 }
}
