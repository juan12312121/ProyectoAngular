import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
  error: string = '';  // Para almacenar el mensaje de error

  constructor(private reservasService: ReservationsService) {}

  ngOnInit(): void {
    this.getPagos();
  }

  // Método para obtener los pagos
  getPagos(): void {
    this.reservasService.verPagos().subscribe(
      (data) => {
        console.log('Datos obtenidos de pagos:', data);  // Log de los datos obtenidos

        if (data.error) {
          // Si hay un error, mostramos el mensaje de error
          this.error = data.error;
        } else {
          this.pagos = data;  // Si no hay error, asignamos los pagos
        }
      },
      (error) => {
        // Si hay un error con la solicitud HTTP
        this.error = 'Hubo un error al obtener los pagos. Por favor, intente más tarde.';
        console.error('Error en la solicitud', error);
      }
    );
  }
}
