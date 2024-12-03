import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationsService } from '../../core/services/reservations.service';
import { SidebarComponent } from '../sidebar/sidebar.component';


@Component({
  selector: 'app-detalle-reportes',
  standalone: true,
  imports: [SidebarComponent,CommonModule],
  templateUrl: './detalle-reportes.component.html',
  styleUrls: ['./detalle-reportes.component.css']
})
export default class DetalleReportesComponent implements OnInit {
  reporteDetails: any = {};  // Inicializa como un objeto vacío
  loading: boolean = true;  // Para mostrar un indicador de carga
  error: string = '';  // Para mostrar posibles errores
reportes: any;
formatearFecha: any;
mensaje: any;

  constructor(
    private reservationsService: ReservationsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const reporteId = +this.route.snapshot.paramMap.get('id')!;  // Obtén el ID desde la URL
    console.log('ID del reporte obtenido:', reporteId);
    
    const token = localStorage.getItem('authToken') || '';
    console.log('Token de autenticación:', token);
    
    if (token) {
      console.log('Token encontrado. Llamando a getReporteDetails...');
      this.getReporteDetails(reporteId, token);
    } else {
      console.error('Token no encontrado');
      this.error = 'Token de autenticación no encontrado.';
      this.loading = false;
    }
  }

  // Método para obtener los detalles del reporte
  getReporteDetails(id: number, token: string): void {
    console.log('Llamando a getReporteDetails con ID:', id, 'y token:', token);
    
    this.reservationsService.getReporteDetails(id, token).subscribe({
      next: (data) => {
        console.log('Datos recibidos de la API:', data);  // Verifica la respuesta de la API
        
        // Asigna directamente el valor de 'reporte' a reporteDetails
        this.reporteDetails = data.reporte;  // Accede a la propiedad 'reporte'
        
        console.log('reporteDetails:', this.reporteDetails);  // Verifica el valor de reporteDetails
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar los detalles:', err);
        this.error = 'Hubo un error al cargar los detalles del reporte.';
        this.loading = false;
      }
    });
  }
  
  
}  
