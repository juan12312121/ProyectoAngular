import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthService } from '../../core/services/auth.service';
import { CarrosService } from '../../core/services/carros.service';
import { ReservationsService } from '../../core/services/reservations.service';
import { NavbarComponent } from '../navbar/navbar.component';
@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [NavbarComponent, CommonModule],
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export default class HistorialComponent implements OnInit, OnDestroy {
payRental(arg0: any) {
throw new Error('Method not implemented.');
}
viewDetails(_t44: any) {
throw new Error('Method not implemented.');
}
  public reservations: any[] = []; // All reservations
  public pendingReservations: any[] = []; // Pending reservations
  public completedReservations: any[] = []; // Completed reservations
  public canceledReservations: any[] = []; // Canceled reservations
  public carImages: { [key: string]: string } = {}; // Car images dictionary
  public loadingImage: boolean = false; // Image loading state
  private reservationUpdatedSubscription: Subscription = new Subscription();

  constructor(
    private authService: AuthService, // Authentication service
    private reservationsService: ReservationsService, // Reservations service
    private carrosService: CarrosService, // Cars service
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserReservations();
  }

  ngOnDestroy(): void {
    // Unsubscribe to avoid memory leaks
    if (this.reservationUpdatedSubscription) {
      this.reservationUpdatedSubscription.unsubscribe();
    }
  }

  // Load reservations for the logged-in user
  loadUserReservations(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.reservationsService.getReservationsByUserId(userId).subscribe({
        next: (reservations) => {
          this.reservations = reservations;
          console.log('Reservations:', this.reservations);  // Verifica si las reservas se están cargando correctamente
          this.organizeReservationsByType();
          this.loadCarImages();
        },
        error: (error) => {
          console.error('Error loading reservations:', error);
        }
      });
    }
  }

  // Organize reservations by their state
  organizeReservationsByType(): void {
    this.pendingReservations = this.reservations.filter(r => r.estado_reserva === 'Pendiente');
    this.completedReservations = this.reservations.filter(r => r.estado_reserva === 'Completada');
    this.canceledReservations = this.reservations.filter(r => r.estado_reserva === 'Cancelada');
  }

  // Load car images for reservations
  loadCarImages() {
    this.reservations.forEach(reservation => {
      this.carrosService.getCarro(reservation.id_carro).subscribe(car => {
        let imageUrl = car.imagen?.replace(/\\/g, '/').replace(/^\/+/, '');
        this.carImages[reservation.id_carro] = imageUrl
          ? `http://localhost:3500/${imageUrl}`
          : 'http://localhost:3500/uploads/ruta/a/imagen/predeterminada.jpg';
      });
    });
  }

  // Handle reservation cancellation
  cancelReservation(reservationId: number): void {
    console.log(`[INFO] Attempting to cancel reservation with ID: ${reservationId}`);

    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción cancelará la reserva. ¡No se puede deshacer!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No, volver',
    }).then((result) => {
      console.log('[INFO] User confirmation:', result);

      if (result.isConfirmed) {
        console.log(`[INFO] User confirmed cancellation for ID: ${reservationId}`);

        this.reservationsService.cancelReservation(reservationId).subscribe({
          next: (response: any) => {
            console.log('[SUCCESS] Reservation cancelled successfully:', response);

            // Remove the canceled reservation from the list and update categorized lists
            this.reservations = this.reservations.filter(
              (reservation) => reservation.id_reserva !== reservationId
            );
            this.organizeReservationsByType(); // Reorganize after cancellation

            Swal.fire({
              title: 'Cancelada',
              text: 'La reserva ha sido cancelada con éxito.',
              icon: 'success',
              confirmButtonColor: '#3085d6',
            });
          },
          error: (error: any) => {
            console.error('[ERROR] Problem occurred while cancelling reservation:', error);

            Swal.fire({
              title: 'Error',
              text: 'Hubo un problema al cancelar la reserva. Por favor, intenta nuevamente.',
              icon: 'error',
              confirmButtonColor: '#d33',
            });
          },
        });
      } else {
        console.log('[INFO] User cancelled the cancellation action.');
      }
    });
  }

  // Get car image URL
  getCarImage(id_carro: number): string {
    return this.carImages[id_carro] || 'http://localhost:3500/uploads/';
  }

  goToPayment(reservationId: number): void {
    // Make sure 'router' is available before trying to navigate
    if (this.router) {
      this.router.navigate(['/pago', reservationId]);
    } else {
      console.error('Router is not defined');
    }
  }
}
