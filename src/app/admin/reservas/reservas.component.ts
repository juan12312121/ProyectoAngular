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
  choferSeleccionadoId: number = 0; 
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
    this.isLoading = true;
    this.reservationsService.getAllReservations(this.currentPage, this.pageSize).subscribe(
      (data) => {
        this.reservations = data;
        this.filterReservations();
        this.totalPages = Math.ceil(this.reservations.length / this.pageSize);
        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = 'Error al cargar las reservas';
        this.isLoading = false;
      }
    );
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
    this.recentReservations = this.reservations.filter(reservation => reservation.estado_reserva === 'Pendiente');
    this.completedReservations = this.reservations.filter(reservation => reservation.estado_reserva === 'Completada');
    this.cancelledReservations = this.reservations.filter(reservation => reservation.estado_reserva === 'Cancelada');
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
