import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { ChatbotComponent } from '../../components/chat-bot/chat-bot.component';
import { AuthService } from '../../core/services/auth.service';
import { CarrosService } from '../../core/services/carros.service';
import { ReservationsService } from '../../core/services/reservations.service';
import { NavbarComponent } from '../navbar/navbar.component';



@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [NavbarComponent,FormsModule,MatIconModule, CommonModule,NgxPaginationModule,ChatbotComponent,MatTooltipModule],
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export default class HistorialComponent implements OnInit, OnDestroy {




  verPagos: any;
payRental(arg0: any) {
throw new Error('Method not implemented.');
}

  public reservations: any[] = []; 
  public pendingReservations: any[] = []; 
  public completedReservations: any[] = []; 
  public canceledReservations: any[] = []; 
  public carImages: { [key: string]: string } = {}; 
  public loadingImage: boolean = false; 
  private reservationUpdatedSubscription: Subscription = new Subscription();
  public reservationPaymentStatus: { [key: number]: boolean } = {};
  public pageArray: any[] = [];
  selectedEstado: string = '';


  items: any[] = []; // Tu lista de datos
  currentPage: number = 1; // Página actual
  itemsPerPage: number = 10; // Número de elementos por página
  totalItems: number = 0; // Total de elementos

  get paginatedItems(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    console.log('Paginated items:', this.items.slice(startIndex, endIndex));  // Para verificar
    return this.items.slice(startIndex, endIndex);
  }
  

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePageArray();
    }
  }
  
  updatePageArray(): void {
    const totalPages = this.totalPages;
    this.pageArray = Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

   // Modify 'paginatedItems' to update 'pageArray' for use in the template
   

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }


  constructor(
    private authService: AuthService, // Authentication service
    private reservationsService: ReservationsService, // Reservations service
    private carrosService: CarrosService, // Cars service
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserReservations();
    const storedEstado = localStorage.getItem('selectedEstado');
    if (storedEstado) {
      this.selectedEstado = storedEstado;
    } else {
      this.selectedEstado = '';
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe to avoid memory leaks
    if (this.reservationUpdatedSubscription) {
      this.reservationUpdatedSubscription.unsubscribe();
    }
  }

 
  // Modify the checkPaymentStatus to log payment status



  viewDetails(reservation: any): void {
    const id = reservation.id_reserva;  // Asegúrate de obtener el ID
    this.router.navigate([`/detalle-renta-usuario/${id}`]);
  }

  // Load reservations for the logged-in user

  loadUserReservations(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.reservationsService.getReservationsByUserId(userId).subscribe({
        next: (reservations) => {
          console.log('Received reservations:', reservations);  // Add this line to inspect the data
          this.reservations = reservations;
          this.totalItems = reservations.length;  // Establecer el total de items
          this.organizeReservationsByType();
        
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

  completeReservation(reservationId: number): void {
    console.log(`[INFO] Attempting to complete reservation with ID: ${reservationId}`);
  
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción marcará la reserva como completada. ¡No se puede deshacer!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, completar',
      cancelButtonText: 'No, volver',
    }).then((result) => {
      console.log('[INFO] User confirmation:', result);
  
      if (result.isConfirmed) {
        console.log(`[INFO] User confirmed completion for ID: ${reservationId}`);
  
        this.reservationsService.completarReserva(reservationId).subscribe({
          next: (response: any) => {
            console.log('[SUCCESS] Reservation completed successfully:', response);
  
            // Update the reservation list after completing the reservation
            this.reservations = this.reservations.filter(
              (reservation) => reservation.id_reserva !== reservationId
            );
            this.organizeReservationsByType();
  
            Swal.fire({
              title: 'Completada',
              text: 'La reserva ha sido completada con éxito.',
              icon: 'success',
              confirmButtonColor: '#3085d6',
            });
          },
          error: (error: any) => {
            console.error('[ERROR] Problem occurred while completing reservation:', error);
  
            Swal.fire({
              title: 'Error',
              text: 'Hubo un problema al completar la reserva. Por favor, intenta nuevamente.',
              icon: 'error',
              confirmButtonColor: '#d33',
            });
          },
        });
      } else {
        console.log('[INFO] User cancelled the completion action.');
      }
    });
  }

  devolverReserva(reservationId: number): void {
    console.log(`[INFO] Attempting to return reservation with ID: ${reservationId}`);
  
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción marcará la reserva como devuelta. ¡No se puede deshacer!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, devolver',
      cancelButtonText: 'No, volver',
    }).then((result) => {
      console.log('[INFO] User confirmation:', result);
  
      if (result.isConfirmed) {
        console.log(`[INFO] User confirmed return for ID: ${reservationId}`);
  
        this.reservationsService.returnReservation(reservationId).subscribe({
          next: (response: any) => {
            console.log('[SUCCESS] Reservation returned successfully:', response);
  
            // Update the reservation list after returning the reservation
            this.reservations = this.reservations.filter(
              (reservation) => reservation.id_reserva !== reservationId
            );
            this.organizeReservationsByType();
  
            Swal.fire({
              title: 'Devolución exitosa',
              text: 'La reserva ha sido marcada como devuelta.',
              icon: 'success',
              confirmButtonColor: '#3085d6',
            });
          },
          error: (error: any) => {
            console.error('[ERROR] Problem occurred while returning reservation:', error);
  
            Swal.fire({
              title: 'Error',
              text: 'Hubo un problema al devolver la reserva. Por favor, intenta nuevamente.',
              icon: 'error',
              confirmButtonColor: '#d33',
            });
          },
        });
      } else {
        console.log('[INFO] User cancelled the return action.');
      }
    });
  }





  goToPayment(reservationId: number): void {
    // Make sure 'router' is available before trying to navigate
    if (this.router) {
      this.router.navigate(['/pago', reservationId]);
    } else {
      console.error('Router is not defined');
    }
  }

  createReport(id_reserva: any) {
    // Navigate to the report creation page with the reservation ID
    this.router.navigate([`/reportes/${id_reserva}`]);
  }

  getReservationStateClass(state: string): string {
    switch (state) {
      case 'Pendiente':
        return 'text-yellow-600';
      case 'Completada':
        return 'text-green-600';
      case 'Cancelada':
        return 'text-red-600';
      case 'Aceptada':
        return 'text-blue-600';
      case 'Confirmada':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  }

  assignReturnPlace(reservation: any): void {
    // Verifica si la reserva tiene los datos necesarios
    if (!reservation || !reservation.id_reserva || !reservation.lugar_devolucion) {
      console.error('Datos incompletos para actualizar lugar de devolución');
      Swal.fire({
        title: 'Error',
        text: 'Datos incompletos para actualizar lugar de devolución',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return;
    }
  
    // Llama al servicio para actualizar el lugar de devolución
    this.reservationsService.updateReturnPlaceStatus(reservation.id_reserva, reservation.lugar_devolucion).subscribe({
      next: (response) => {
        console.log('Lugar de devolución actualizado con éxito:', response);
        Swal.fire({
          title: 'Éxito',
          text: 'Lugar de devolución asignado correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
      },
      error: (error) => {
        console.error('Error al actualizar lugar de devolución:', error);
        Swal.fire({
          title: 'Error',
          text: 'Hubo un error al actualizar el lugar de devolución.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }

  saveSelectedEstado(): void {
    // Guardar el valor del estado de reserva en el localStorage
    localStorage.setItem('selectedEstado', this.selectedEstado);
  }

  filteredReservations() {
    if (this.selectedEstado) {
      return this.reservations.filter(reservation => reservation.estado_reserva === this.selectedEstado);
    }
    return this.reservations;
  }

  
}
