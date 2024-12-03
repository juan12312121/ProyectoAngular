
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReservationsService } from '../../core/services/reservations.service';
import { NavbarComponent } from '../navbar/navbar.component';


@Component({
  selector: 'app-detalle-renta',
  standalone: true,
  imports: [NavbarComponent,CommonModule],
  templateUrl: './detalle-renta.component.html',
  styleUrl: './detalle-renta.component.css'
})
export default class DetalleRentaComponent {
  reservationId!: number;
  reservationDetails: any;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private reservationService: ReservationsService
  ) {}

  ngOnInit(): void {
    // Obtener el parámetro 'id' de la URL
    this.route.params.subscribe((params) => {
      this.reservationId = +params['id_reserva']; // Captura el parámetro 'id' y conviértelo a número
      this.fetchReservationDetails(); // Llama a la función para obtener los detalles
    });
  }

  fetchReservationDetails(): void {
    this.isLoading = true;
    this.reservationService.getReservationDetails(this.reservationId).subscribe(
      (data) => {
        console.log('Datos recibidos de la reserva:', data); // Verifica los datos
        this.reservationDetails = data;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error al obtener los detalles de la reserva:', error); // Verifica errores
        this.isLoading = false;
      }
    );
  }
}
