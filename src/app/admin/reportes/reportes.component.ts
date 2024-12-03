import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Importa Router
import Swal from 'sweetalert2'; // Importa SweetAlert2
import { ReservationsService } from '../../core/services/reservations.service'; // Importa el servicio de reportes
import { SidebarComponent } from "../sidebar/sidebar.component";

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [SidebarComponent, CommonModule],
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export default class ReportesComponent implements OnInit {

  reportes: any[] = [];  // Para almacenar los reportes

  // Inyección de Router en el constructor
  constructor(
    private reportesService: ReservationsService,
    private router: Router  // Inyección correcta de Router
  ) { }

  ngOnInit(): void {
    // Llamar a la función para obtener los reportes cuando el componente se inicializa
    this.getReportes();
  }

  // Método para obtener los reportes
  getReportes(): void {
    this.reportesService.getReports().subscribe({
      next: (data) => {
        this.reportes = data;  // Almacena los reportes obtenidos
        console.log('Reportes:', this.reportes);
      },
      error: (error) => {
        console.error('Error al obtener los reportes:', error);
      }
    });
  }

  // Función para marcar el reporte como "Arreglado"
  arreglarReporte(reporteId: number): void {
    this.reportesService.arreglarReporte(reporteId).subscribe({
      next: (response) => {
        console.log('Reporte arreglado:', response);
        // Aquí puedes actualizar el estado del reporte en la lista, por ejemplo:
        const reporte = this.reportes.find(r => r.idreporte === reporteId);
        if (reporte) {
          reporte.estado = 'Arreglado';  // Actualiza el estado del reporte en el frontend
        }
        
        // Muestra un mensaje de éxito con SweetAlert2
        Swal.fire({
          icon: 'success',
          title: 'Reporte arreglado',
          text: 'El reporte ha sido marcado como arreglado correctamente.',
          confirmButtonText: 'Aceptar'
        });
      },
      error: (error) => {
        console.error('Error al arreglar el reporte:', error);
        
        // Muestra un mensaje de error con SweetAlert2
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al arreglar el reporte. Intenta nuevamente.',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }

  // Función para navegar a la vista de detalles del reporte
  verDetalles(reporteId: number): void {
    console.log('Ver detalles de reporte con ID:', reporteId);
    // Asegúrate de pasar un número (o string) al router
    this.router.navigate([`/detalle-reporte-admin/${reporteId}`]);
  }
}
