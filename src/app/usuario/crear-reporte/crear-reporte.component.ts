import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2'; // Importa SweetAlert2
import { ChatbotComponent } from '../../components/chat-bot/chat-bot.component';
import { ReservationsService } from '../../core/services/reservations.service'; // Import ReservationsService
import { NavbarComponent } from '../navbar/navbar.component';


@Component({
  standalone: true,
  imports: [NavbarComponent, CommonModule, FormsModule,ChatbotComponent],
  selector: 'app-crear-reporte',
  templateUrl: './crear-reporte.component.html',
  styleUrls: ['./crear-reporte.component.css']
})
export default class CrearReporteComponent implements OnInit {
  // Definir el tipo de id_reserva como number o null
  reportData: {
    id_reserva: number | null; // Cambiar para que acepte null o number
    tipo_reporte: string;
    descripcion: string;
  } = {
    id_reserva: null,
    tipo_reporte: '',
    descripcion: ''
  };

  constructor(
    private reservationsService: ReservationsService, // Inject the ReservationsService
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Obtener el ID de la reserva desde la URL
    this.route.paramMap.subscribe(params => {
      const idReservaParam = params.get('id_reserva');
      if (idReservaParam) {
        this.reportData.id_reserva = +idReservaParam; // Convertir a number
        console.log('ID de reserva obtenido de la URL:', this.reportData.id_reserva); // Log del ID de la reserva
      }
    });
  }

  onSubmit(): void {
    const { id_reserva, tipo_reporte, descripcion } = this.reportData;

    // Validar si el id_reserva es válido antes de enviar
    if (id_reserva === null || id_reserva === undefined) {
      console.error('El ID de la reserva es obligatorio'); // Log de error si el id_reserva no es válido
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El ID de la reserva es obligatorio.',
        confirmButtonText: 'Aceptar'
      });
      return; // Detener el envío si no hay id_reserva
    }

    console.log('Datos del reporte a enviar:', this.reportData); // Log de los datos del reporte antes de enviar

    // Aquí aseguramos que el id_reserva es un número antes de llamar al servicio
    const validReportData = {
      id_reserva: id_reserva,  // Este es un número, no null
      tipo_reporte: tipo_reporte,
      descripcion: descripcion
    };

    // Llamar al método createReport desde ReservationsService
    this.reservationsService.createReport(validReportData).subscribe(
      (response: any) => {
        console.log('Reporte creado exitosamente:', response); // Log de éxito con la respuesta del backend
        // Mostrar alerta de éxito si se crea el reporte correctamente
        Swal.fire({
          icon: 'success',
          title: '¡Reporte Creado!',
          text: 'El reporte se ha creado exitosamente.',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          // Limpiar los campos del formulario si es necesario
          this.reportData = { id_reserva: null, tipo_reporte: '', descripcion: '' };
          console.log('Campos del formulario limpiados'); // Log de limpieza de formulario
        });
      },
      (error) => {
        console.error('Error al crear el reporte:', error); // Log de error con la respuesta del backend
        // Mostrar alerta de error si hay un problema creando el reporte
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al crear el reporte: ' + (error.error?.message || 'Intenta nuevamente más tarde'),
          confirmButtonText: 'Aceptar'
        });
      }
    );
  }
}
