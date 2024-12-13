import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import Swal from 'sweetalert2'; // Importa SweetAlert2
import { AuthService } from '../../core/services/auth.service';
import { ReservationsService } from '../../core/services/reservations.service';
import { SidebarChoferComponent } from '../sidebar-chofer/sidebar-chofer.component';

@Component({
  selector: 'app-reservas-asignadas',
  standalone: true,
  imports: [SidebarChoferComponent, CommonModule,NgxPaginationModule],
  templateUrl: './reservas-asignadas.component.html',
  styleUrls: ['./reservas-asignadas.component.css']
})
export default class ReservasAsignadasComponent implements OnInit {
  currentPage: number = 1; 
  itemsPerPage: number = 5; 
  totalItems: number = 0;
  totalPages: number = 0;
  driverId: number | null = null; // ID del chofer
  reservations: any[] = []; // Todas las reservas
  paginatedReservations: any[] = []; // Reservas paginadas
  errorMessage: string = ''; // Para mostrar mensajes de error

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
        this.totalItems = this.reservations.length; // Actualiza el total de elementos
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);  // Calculate total pages
        this.updatePaginatedReservations();  // Update the paginated reservations
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


  markUserAsPickedUp(reservationId: number): void {
    if (!reservationId) {
      this.errorMessage = 'ID de reserva es necesario.';
      return;
    }

    this.reservationsService.updatePickupStatus2(reservationId).subscribe(
      (response) => {
        // Mostrar SweetAlert de éxito
        Swal.fire({
          icon: 'success',
          title: '¡Estado de recogida actualizado!',
          text: `El estado de la reserva ${reservationId} se ha marcado como "Recogido".`,
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#4f52ba'
        }).then(() => {
          // Aquí puedes agregar código adicional para actualizar la vista
        });
      },
      (error) => {
        this.errorMessage = error.message || 'Error al actualizar el estado de recogida.';
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

  updatePaginatedReservations(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedReservations = this.reservations.slice(
      startIndex,
      endIndex
    );
  }
  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePaginatedReservations();
  }
  getButtonVisibility(reservation: any, type: string): boolean {
    switch (type) {
      case 'Entregado':
        return reservation.entrega === 'Pendiente';
      case 'Recogido':
        return reservation.estado_reserva !== 'Completada' && reservation.lugar_devolucion !== '';
      case 'Reporte':
        return reservation.estado_reserva === 'Completada';
      case 'UsuarioRecogido':
        return reservation.estado_recogida_usuario === 'En camino';
      default:
        return false;
    }
  }
  
}
