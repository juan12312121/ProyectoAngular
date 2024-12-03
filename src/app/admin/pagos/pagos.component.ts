  import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ReservationsService } from '../../core/services/reservations.service'; // Asegúrate de importar el servicio
import { SidebarComponent } from '../sidebar/sidebar.component';

  @Component({
    standalone: true,
    imports: [SidebarComponent, CommonModule],
    selector: 'app-pagos-admin',
    templateUrl: './pagos.component.html',
    styleUrls: ['./pagos.component.css']
  })
  export default class PagosComponent implements OnInit {
    pagos: any[] = [];  // Para almacenar los pagos obtenidos
    paginacionPagos: any[] = [];  // Para almacenar los pagos de la página actual
    error: string = '';  // Para almacenar el mensaje de error
    pageSize: number = 10;  // Número de elementos por página
    currentPage: number = 0;  // Página actual

    constructor(private reservasService: ReservationsService) {}

    ngOnInit(): void {
      this.getPagos();
    }

    // Método para obtener los pagos
    getPagos(): void {
      this.reservasService.verPagos().subscribe(
        (data) => {
          console.log('Datos recibidos del backend:', data); 
          if (data.error) {
            this.error = data.error;
          } else {
            this.pagos = data;
            this.updatePaginatedData();
          }
        },
        (error) => {
          this.error = 'Hubo un error al obtener los pagos. Por favor, intente más tarde.';
          console.error('Error en la solicitud', error);
        }
      );
    }

    // Actualiza la lista de pagos paginados
    updatePaginatedData(): void {
      const start = this.currentPage * this.pageSize;
      const end = start + this.pageSize;
      this.paginacionPagos = this.pagos.slice(start, end);
    }

    // Cambia la página
    onPageChange(page: number): void {
      if (page >= 0 && page < this.totalPages()) {
        this.currentPage = page;
        this.updatePaginatedData();
      }
    }

    // Calcula el número total de páginas
    totalPages(): number {
      return Math.ceil(this.pagos.length / this.pageSize);
    }

    procesarReembolso(idReserva: number): void {
      this.reservasService.cambiarEstadoPago(idReserva).subscribe(
        (response) => {
          if (response.success) {
            // Mostrar alerta de éxito
            Swal.fire({
              icon: 'success',
              title: '¡Éxito!',
              text: 'Estado de pago cambiado a Reembolso con éxito.',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: '#4CAF50',
            }).then(() => {
              this.getPagos(); // Refresca la lista de pagos después de cerrar la alerta
            });
          } else {
            // Mostrar alerta de error
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: response.message || 'No se pudo cambiar el estado de pago.',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: '#F44336',
            });
          }
        },
        (error) => {
          console.error('Error al cambiar el estado de pago:', error);
          // Mostrar alerta de error en caso de fallo
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al intentar cambiar el estado de pago.',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#F44336',
          });
        }
      );
    }
    
  }
