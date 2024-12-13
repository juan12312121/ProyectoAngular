import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChatbotComponent } from '../../components/chat-bot/chat-bot.component';
import { AuthService } from '../../core/services/auth.service';
import { ReservationsService } from '../../core/services/reservations.service';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  standalone: true,  
  imports: [NavbarComponent, CommonModule, ChatbotComponent],  
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export default class PerfilComponent implements OnInit {

  userName: string = '';
  correo: string = '';
  userPhone: string = '';  
  userAddress: string = ''; 
  userSince: string = ''; 
  errorMessage: string = ''; 
  loading: boolean = true;  
  userProfileImage: any;
  public reservations: any[] = [];
  showReservations: boolean = false; // <-- Added this line

  get hasConfirmedReservation(): boolean {
    return this.reservations && this.reservations.some(reservation => reservation.estado_reserva === 'Confirmada');
  }


  constructor(
    private authService: AuthService,
    private router: Router,
    private reservationsService: ReservationsService  
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadUserReservations();
  }

  loadUserProfile(): void {
    this.loading = true;  
    this.errorMessage = '';  

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);  
      return;
    }

    this.authService.getUserProfile().subscribe(
      (response) => {
        if (response && response.length > 0) {
          const user = response[0];
          this.userName = user.nombre_completo;
          this.correo = user.correo;
          this.userSince = new Date(user.fecha_creacion).toLocaleDateString();
          this.loading = false;  
        } else {
          this.errorMessage = 'No se encontraron datos del perfil.';
          this.loading = false;
        }
      },
      (error) => {
        this.loading = false; 
        console.error('Error al cargar el perfil:', error);
        this.errorMessage = 'Ocurrió un error al cargar tus datos. Por favor, inténtalo nuevamente más tarde.';
      }
    );
  }

  loadUserReservations(showPaidOnly: boolean = false): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.reservationsService.getReservationsByUserId(userId).subscribe({
        next: (reservations) => {
          console.log('Received reservations:', reservations);
  
          // Filtrar solo las reservas que estén "Confirmada"
          // Si showPaidOnly es true, filtrar también por "Pagado"
          this.reservations = reservations.filter(reservation => 
            reservation.estado_reserva === 'Confirmada' && 
            (showPaidOnly ? reservation.estado_pago === 'Pagado' : true)
          );
        },
        error: (error) => {
          console.error('Error loading reservations:', error);
          this.errorMessage = 'Ocurrió un error al cargar las reservas. Intenta nuevamente más tarde.';
        }
      });
    }
  }
  

}
