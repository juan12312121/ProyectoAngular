import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { ReservationsService } from '../../core/services/reservations.service';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [SidebarComponent, CommonModule, NgxPaginationModule], // Ensure pagination module is included
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css'],
  animations: [
    // Animación general para el contenedor principal
    trigger('fadeIn', [
      transition('hidden => visible', [
        style({ opacity: 0 }),
        animate('800ms ease-out', style({ opacity: 1 })),
      ]),
    ]),
    // Animación para las tarjetas
    trigger('cardAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-20px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
    ]),
  ],
})
export default class ReservasComponent implements OnInit {
  reservations: any[] = []; // Lista de reservas
  errorMessage: string = ''; // Mensaje de error
  isLoading: boolean = false; // Indicador de carga
  currentPage: number = 1; // Página actual
  pageSize: number = 8; // Número de reservas por página
  totalPages: number = 0; // Total de páginas

  constructor(private reservationsService: ReservationsService) {}

  ngOnInit(): void {
    this.loadReservations(); // Cargar reservas al inicializar el componente
  }

  // Método para cargar todas las reservas
  loadReservations(): void {
    this.isLoading = true; // Mostrar indicador de carga
    this.reservationsService.getAllReservations().subscribe(
      (data) => {
        this.reservations = data; // Guardar las reservas obtenidas
        this.totalPages = Math.ceil(this.reservations.length / this.pageSize); // Calcular total de páginas
        console.log('Reservas cargadas:', this.reservations);
        this.isLoading = false; // Ocultar indicador de carga
      },
      (error) => {
        this.errorMessage = 'Error al cargar las reservas'; // Mostrar mensaje de error
        console.error('Error al cargar las reservas:', error);
        this.isLoading = false; // Ocultar indicador de carga
      }
    );
  }

  // Método para cambiar de página
  changePage(page: number): void {
    if (page < 1) page = 1;
    if (page > this.totalPages) page = this.totalPages;
    this.currentPage = page;
  }

  // Método para refrescar las reservas manualmente
  refreshReservations(): void {
    console.log('Refrescando reservas...');
    this.loadReservations();
  }

  acceptReservation(id: number): void {
    console.log(`Reserva ${id} aceptada`);
    // Lógica para aceptar la reserva
  }
  
  rejectReservation(id: number): void {
    console.log(`Reserva ${id} rechazada`);
    // Lógica para rechazar la reserva
  }
  
  viewDetails(id: number): void {
    console.log(`Ver detalles de la reserva ${id}`);
    // Navegar a la página de detalles o mostrar un modal
  }
}
