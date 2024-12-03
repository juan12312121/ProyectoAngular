import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChatbotComponent } from '../../components/chat-bot/chat-bot.component';
import { AuthService } from '../../core/services/auth.service'; // Importar AuthService
import { NavbarComponent } from '../navbar/navbar.component';


@Component({
  standalone: true,  // Componente independiente
  imports: [NavbarComponent, CommonModule,ChatbotComponent],  // Importar CommonModule para usar ngIf y otros directivas
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export default class PerfilComponent implements OnInit {


  userName: string = '';
  correo: string = '';
  userPhone: string = '';  // Teléfono sin valor predeterminado
  userAddress: string = ''; // Dirección sin valor predeterminado (puedes agregar un campo en la base si es necesario)
  userSince: string = ''; // Fecha de creación
  errorMessage: string = ''; // Para mostrar errores al usuario
  loading: boolean = true;  // Para mostrar un cargando
userProfileImage: any;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.loading = true;  // Activar estado de carga
    this.errorMessage = ''; // Limpiar mensaje de error
  
    // Verificar si el usuario está autenticado
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);  // Redirigir a login si no está autenticado
      return;
    }
  
    // Obtener los datos del perfil
    this.authService.getUserProfile().subscribe(
      (response) => {
        if (response && response.length > 0) {
          // Acceder al primer objeto del arreglo
          const user = response[0];  // Suponemos que siempre habrá al menos un usuario
  
          // Asignar los datos al componente
          this.userName = user.nombre_completo;  // nombre_completo de la base de datos
          this.correo = user.correo;  // correo de la base de datos
          
          this.userSince = new Date(user.fecha_creacion).toLocaleDateString(); // Convertir la fecha
          this.loading = false;  // Desactivar el estado de carga
        } else {
          this.errorMessage = 'No se encontraron datos del perfil.';
          this.loading = false;
        }
      },
      (error) => {
        this.loading = false; // Desactivar el estado de carga
        console.error('Error al cargar el perfil:', error);
        this.errorMessage = 'Ocurrió un error al cargar tus datos. Por favor, inténtalo nuevamente más tarde.';  // Mostrar mensaje de error
      }
    );
  }

  verPromociones(){

 }

 verIncidencias(){
  
 }

}
