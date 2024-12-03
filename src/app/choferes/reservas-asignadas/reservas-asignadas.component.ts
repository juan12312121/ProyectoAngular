import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
    private authService: AuthService,
    private router: Router
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
        this.reservations = reservations;  // Todas las reservas
      },
      (error) => {
        this.errorMessage = error.message || 'Error al obtener las reservas del chofer.';
      }
    );
  }

  // Cambiar el estado de la entrega a "Entregado"
  changeDeliveryStatus(reservationId: number, deliveryStatus: string): void {
    if (!reservationId || !deliveryStatus) {
      this.errorMessage = 'ID de reserva y estado de entrega son necesarios.';
      return;
    }

    this.reservationsService.updateDeliveryStatus(reservationId, deliveryStatus).subscribe(
      (response) => {
        // Mostrar SweetAlert de éxito
        Swal.fire({
          icon: 'success',
          title: `¡Carro ${deliveryStatus === 'Entregado' ? 'entregado' : 'recogido'} con éxito!`,
          text: `La reserva ha sido marcada como ${deliveryStatus}.`,
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


  createReport(id_reserva: any) {
    // Navigate to the report creation page with the reservation ID
    this.router.navigate([`/reporte-chofer/${id_reserva}`]);
  }
}
