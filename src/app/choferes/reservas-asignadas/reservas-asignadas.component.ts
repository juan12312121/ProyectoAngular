import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2'; // Importa SweetAlert2
import { AuthService } from '../../core/services/auth.service';
import { ReservationsService } from '../../core/services/reservations.service';
import { SidebarChoferComponent } from '../sidebar-chofer/sidebar-chofer.component';

@Component({
  selector: 'app-reservas-asignadas',
  standalone: true,
  imports: [SidebarChoferComponent, CommonModule],
  templateUrl: './reservas-asignadas.component.html',
  styleUrls: ['./reservas-asignadas.component.css']
})
export default class ReservasAsignadasComponent implements OnInit {
  driverId: number | null = null;  // ID del chofer
  reservations: any[] = [];  // Todas las reservas
  pendingReservations: any[] = [];  // Reservas pendientes
  deliveredReservations: any[] = [];  // Reservas entregadas
  errorMessage: string = '';  // Para mostrar mensajes de error

  constructor(
    private reservationsService: ReservationsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.driverId = this.authService.getLoggedDriverId();
    if (this.driverId !== null) {
      this.getDriverReservations(this.driverId);
    } else {
      this.errorMessage = 'No se pudo obtener el ID del chofer logueado.';
    }
  }

  // Obtener las reservas asignadas al chofer
  getDriverReservations(driverId: number): void {
    this.reservationsService.getReservationsByDriver(driverId).subscribe(
      (reservations) => {
        this.reservations = reservations;

        // Filtrar las reservas según el campo "entrega"
        this.pendingReservations = reservations.filter(
          r => r.entrega !== 'Entregado'
        );
        this.deliveredReservations = reservations.filter(
          r => r.entrega === 'Entregado'
        );
      },
      (error) => {
        this.errorMessage = error.message || 'Error al obtener las reservas del chofer.';
      }
    );
  }

  // Cambiar el estado de la entrega a "Entregado"
  changeDeliveryStatus(reservationId: number): void {
    if (!reservationId) {
      this.errorMessage = 'ID de reserva no válido.';
      return;
    }

    this.reservationsService.updateDeliveryStatus(reservationId, 'Entregado').subscribe(
      (response) => {
        // Mostrar SweetAlert de éxito
        Swal.fire({
          icon: 'success',
          title: '¡Carro entregado con éxito!',
          text: 'La reserva ha sido marcada como entregada.',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#4f52ba'
        }).then(() => {
          // Actualizamos las reservas después de cambiar el estado
          this.getDriverReservations(this.driverId!);
        });
      },
      (error) => {
        this.errorMessage = error.message || 'Error al actualizar el estado de entrega.';
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: this.errorMessage,
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#4f52ba'
        });
      }
    );
  }
}
