import { Component } from '@angular/core';
import { ReservationsService } from '../../core/services/reservations.service'; // Import ReservationsService
import { SidebarChoferComponent } from '../sidebar-chofer/sidebar-chofer.component';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-reporte-chofer',
  standalone: true,
  imports: [SidebarChoferComponent,CommonModule,FormsModule],
  templateUrl: './reporte-chofer.component.html',
  styleUrl: './reporte-chofer.component.css'
})
export default class ReporteChoferComponent {

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
      const idReserva = +idReservaParam; // Convertir a number

      // Verificar si el valor convertido es un número válido
      if (!isNaN(idReserva)) {
        this.reportData.id_reserva = idReserva;
        console.log('ID de reserva obtenido de la URL:', this.reportData.id_reserva);
      } else {
        console.error('El ID de la reserva no es válido');
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'El ID de la reserva no es válido.',
          confirmButtonText: 'Aceptar'
        });
      }
    } else {
      console.error('No se proporcionó el ID de la reserva en la URL');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se proporcionó el ID de la reserva en la URL.',
        confirmButtonText: 'Aceptar'
      });
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
      console.error('Error al crear el reporte:', error); // Log de error
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al crear el reporte.',
        confirmButtonText: 'Aceptar'
      });
    }
  );
}

}
