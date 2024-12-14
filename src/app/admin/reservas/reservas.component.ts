import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import Swal from 'sweetalert2';
import { AuthService } from '../../core/services/auth.service';
import { ReservationsService } from '../../core/services/reservations.service';
import { SidebarComponent } from '../sidebar/sidebar.component';


@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [SidebarComponent, CommonModule, NgxPaginationModule, FormsModule],
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css'],
})
export default class ReservasComponent implements OnInit {

  reservations: any[] = [];
  recentReservations: any[] = [];
  completedReservations: any[] = [];
  cancelledReservations: any[] = [];
  errorMessage: string = '';
  isLoading: boolean = false;
  currentPage: number = 1;
  pageSize: number = 8;
  totalPages: number = 0;
  choferes: any[] = [];
  public pendingReservations: any[] = []; 
  choferSeleccionadoId: number = 0; 
  public canceledReservations: any[] = []; 
  filteredReservations: any[] = [];
  selectedEstado: string = '';
reservation: any;

  constructor(
    private http: HttpClient, // Inject HttpClient here
    private reservationsService: ReservationsService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadReservations();
    this.loadChoferes();
    
  }

  loadReservations(): void {
    console.log('Iniciando carga de reservas...');
    this.isLoading = true;

    this.reservationsService.getAllReservations(this.currentPage, this.pageSize).subscribe(
      (data) => {
        console.log('Datos recibidos del servicio:', data); // Log para los datos recibidos
        this.reservations = data;

        console.log('Antes de filtrar reservas:', this.reservations); // Log antes de aplicar el filtro
        this.filterReservations();
        console.log('Después de filtrar reservas:', this.reservations); // Log después del filtro

        this.totalPages = Math.ceil(this.reservations.length / this.pageSize);
        console.log('Número total de páginas calculado:', this.totalPages); // Log para verificar el total de páginas

        this.filterReservations();

        this.isLoading = false;
        console.log('Carga de reservas completada.');
      },
      (error) => {
        console.error('Error al cargar las reservas:', error); // Log para errores
        this.errorMessage = 'Error al cargar las reservas';
        this.isLoading = false;
      }
    );
}
saveSelectedEstado(): void {
  // Guardar el valor del estado de reserva en el localStorage
  localStorage.setItem('selectedEstado', this.selectedEstado);
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

  getChoferById(choferId: number): any {
    return this.choferes.find(chofer => chofer.id === choferId);
  }

  loadChoferes(): void {
    this.isLoading = true;
    this.authService.getAllChoferes().subscribe(
      (data: any[]) => {
        this.choferes = data.map((chofer) => ({
          id: chofer.id,
          nombre_completo: chofer.nombre_completo
        }));
        this.isLoading = false;
      },
      (error) => {
        console.error('Error al cargar los choferes:', error);
        this.errorMessage = 'Error al cargar los choferes';
        this.isLoading = false;
      }
    );
  }

  onChoferSelected(event: any): void {
    console.log('Chofer seleccionado:', event.target.value);
   
  }

  acceptReservation(reservationId: number): void {
    this.reservationsService.acceptReservation(reservationId).subscribe({
      next: () => {
        Swal.fire({
          title: '¡Éxito!',
          text: 'La reserva ha sido aceptada exitosamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#3085d6',
        }).then(() => {
          this.loadReservations();
        });
      },
      error: (err) => {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo aceptar la reserva. Inténtalo nuevamente.',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#d33',
        });
      },
    });
  }

  filterReservations(): void {
    if (this.selectedEstado) {
      this.filteredReservations = this.reservations.filter(reservation => 
        reservation.estado_reserva === this.selectedEstado
      );
    } else {
      this.filteredReservations = this.reservations;
    }
    this.totalPages = Math.ceil(this.filteredReservations.length / this.pageSize);
  }


  changePage(page: number): void {
    if (page < 1) page = 1;
    if (page > this.totalPages) page = this.totalPages;
    this.currentPage = page;
    this.loadReservations();
  }

  refreshReservations(): void {
    this.loadReservations();
  }

  organizeReservationsByType(): void {
    this.pendingReservations = this.reservations.filter(r => r.estado_reserva === 'Pendiente');
    this.completedReservations = this.reservations.filter(r => r.estado_reserva === 'Completada');
    this.canceledReservations = this.reservations.filter(r => r.estado_reserva === 'Cancelada');
  }




  viewDetails(id: number): void {
    this.router.navigate([`/detalle-renta/${id}`]);
  }

  assignDriverToReservation(reservationId: number, choferId: number): void {
    // Verificar que el chofer esté seleccionado
    if (!choferId) {
      Swal.fire({
        title: 'Error',
        text: 'Por favor, selecciona un chofer.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#d33',
      });
      return; // No continuar si no hay chofer seleccionado
    }
  
    // Verificar que el ID de la reserva esté presente
    if (!reservationId) {
      Swal.fire({
        title: 'Error',
        text: 'El ID de la reserva es inválido.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#d33',
      });
      return;
    }
  
    this.isLoading = true;
  
    // Llamar al servicio para asignar el chofer a la reserva
    this.reservationsService.assignDriverToReservation(reservationId, choferId).subscribe({
      next: () => {
        Swal.fire({
          title: '¡Éxito!',
          text: 'Chofer asignado exitosamente a la reserva.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#3085d6',
        }).then(() => {
          this.loadReservations(); // Recargar las reservas después de asignar el chofer
        });
      },
      error: (error) => {
        console.error('Error al asignar chofer:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo asignar el chofer a la reserva. Inténtalo nuevamente.',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#d33',
        });
        this.isLoading = false;
      },
    });
  }

  rejectReservation(reservationId: number): void {
    // Llamar al servicio para rechazar la reserva
    this.reservationsService.rejectedReservation(reservationId).subscribe({
      next: () => {
        Swal.fire({
          title: '¡Éxito!',
          text: 'La reserva ha sido rechazada exitosamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#3085d6',
        }).then(() => {
          // Recargar las reservas después de rechazarla
          this.loadReservations();
        });
      },
      error: (err) => {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo rechazar la reserva. Inténtalo nuevamente.',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#d33',
        });
      },
    });
  }
  
  
  
  onChoferSeleccionadoChange(event: any): void {
    this.choferSeleccionadoId = event.target.value ? Number(event.target.value) : 0;
    const chofer = this.getChoferById(this.choferSeleccionadoId);
    if (chofer) {
      console.log('Chofer seleccionado:', chofer.nombre_completo);
    } else {
      console.log('No chofer seleccionado');
    }
  }

  
}
