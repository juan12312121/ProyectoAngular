import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { AuthService } from '../../core/services/auth.service';
import { SidebarComponent } from '../sidebar/sidebar.component';

// Define the Reserva interface for type safety
export interface Reserva {
  id_reserva: number;
  fecha_inicio: string;
  fecha_fin: string;
  estado_reserva: string;
  monto_reserva: number;
  tipo_reserva: string;
  estado_pago: string;
  nombre_completo: string;
  correo: string;
  marca: string;
  modelo: string;
  color: string;
  // Campos del reporte
  idreporte?: number;
  tipo_reporte?: string;
  descripcion?: string;
  estado_reporte?: string;
  fecha_reporte?: string | null; 
}


@Component({
  selector: 'app-historial-usuarios',
  standalone: true,
  imports: [SidebarComponent, CommonModule, NgxPaginationModule],
  templateUrl: './historial-usuarios.component.html',
  styleUrls: ['./historial-usuarios.component.css']
})
export default class HistorialUsuariosComponent implements OnInit {
  historial: Reserva[] = []; // This will hold the history data
  mensaje: string = ''; // Message for errors or empty states
  usuarioId: number | null = null;
  currentPage: number = 1; // Pagination for the current page
  pageSize: number = 10;  // Items per page

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const usuarioIdParam = this.route.snapshot.paramMap.get('id');
    this.usuarioId = usuarioIdParam ? +usuarioIdParam : null;

    if (this.usuarioId !== null) {
      this.obtenerHistorial();
    } else {
      this.mensaje = 'ID de usuario no válido.';
    }
  }

  // Method to get history from the service
  obtenerHistorial(): void {
    if (this.usuarioId !== null) {
      this.authService.verHistorial(this.usuarioId).subscribe(
        (data) => {
          console.log('Datos recibidos del historial:', data);
          if (Array.isArray(data.historial)) {
            this.historial = data.historial; // Assign the history data
            this.mensaje = ''; // Clear the error message
          } else {
            console.error('La propiedad historial no es un arreglo');
            this.mensaje = 'No se pudo obtener el historial. Inténtalo más tarde.';
          }
        },
        (error) => {
          console.error('Error al obtener historial:', error);
          this.mensaje = 'No se pudo obtener el historial. Inténtalo más tarde.';
        }
      );
    }
  }

  // Format a date in a human-readable format
  formatearFecha(fecha: string | null): string {
    if (!fecha) {
      return 'No disponible';
    }
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  
}
