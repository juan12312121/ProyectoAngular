import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { ChatbotComponent } from '../../components/chat-bot/chat-bot.component';
import { ReservationsService } from '../../core/services/reservations.service';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  standalone: true,
  imports: [NavbarComponent, CommonModule, FormsModule, ChatbotComponent],
  selector: 'app-crear-reporte',
  templateUrl: './crear-reporte.component.html',
  styleUrls: ['./crear-reporte.component.css'],
})
export default class CrearReporteComponent implements OnInit {
  // Datos del reporte
  reportData = {
    id_reserva: null as number | null,
    tipo_reporte: '',
    descripcion: '',
  };

  // Mensaje de advertencia para palabras ofensivas
  offensiveMessage = '';

  // Lista de palabras ofensivas
  private palabrasSoeces: string[] = [
    'idiota',
    'estúpido',
    'imbécil',
    'tonto',
    'maldito',
    'grosero',
    'pendejo',
    'cabron',
    'chingada',
    'chingado',
    'puto',
    'puta',
    'pito',
    'madre',
    'hijo de puta',
    'culero',
    'mierda',
    'baboso',
    'tarado',
    'estupidez',
    'pinche',
    'cabrón',
    'verga',
    'mamada',
    'chingón',
    'culera',
    'jodido',
    'perra',
    'zorra',
    'estúpida',
    'marica',
    'menso',
    'mamón',
    'coño',
    'imbécil',
    'naco',
  ];

  constructor(
    private reservationsService: ReservationsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idReservaParam = params.get('id_reserva');
      if (idReservaParam) {
        this.reportData.id_reserva = +idReservaParam;
      }
    });
  }

  // Método para validar palabras ofensivas dinámicamente
  validateOffensiveWords(): void {
    const descripcionLower = this.reportData.descripcion.toLowerCase();
    const contienePalabrasSoeces = this.palabrasSoeces.some((palabra) =>
      descripcionLower.includes(palabra)
    );

    if (contienePalabrasSoeces) {
      this.offensiveMessage =
        'No permitimos palabras ofensivas en la descripción.';
    } else {
      this.offensiveMessage = '';
    }
  }
  
  onSubmit(): void {
    console.log("Tipo de reporte seleccionado:", this.reportData.tipo_reporte);
    
    const { id_reserva, tipo_reporte, descripcion } = this.reportData;
  
    if (id_reserva === null || id_reserva === undefined) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El ID de la reserva es obligatorio.',
        confirmButtonText: 'Aceptar',
      });
      return;
    }
  
    if (this.offensiveMessage) {
      Swal.fire({
        icon: 'error',
        title: 'Texto no permitido',
        text: 'La descripción contiene palabras ofensivas. Por favor, corrige el texto.',
        confirmButtonText: 'Aceptar',
      });
      return;
    }
  
    
    const validReportData = {
      id_reserva,
      tipo_reporte,
      descripcion,
    };
  
    this.reservationsService.createReport(validReportData).subscribe(
      () => {
        Swal.fire({
          icon: 'success',
          title: '¡Reporte Creado!',
          text: 'El reporte se ha creado exitosamente.',
          confirmButtonText: 'Aceptar',
        }).then(() => {
          this.reportData = { id_reserva: null, tipo_reporte: '', descripcion: '' };
        });
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al crear el reporte: ' + (error.error?.message || 'Intenta nuevamente más tarde'),
          confirmButtonText: 'Aceptar',
        });
      }
    );
  }
  
  
}
