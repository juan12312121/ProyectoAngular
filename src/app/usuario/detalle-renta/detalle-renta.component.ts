
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ReservationsService } from '../../core/services/reservations.service';
import { NavbarComponent } from '../navbar/navbar.component';


@Component({
  selector: 'app-detalle-renta',
  standalone: true,
  imports: [NavbarComponent,CommonModule,FormsModule],
  templateUrl: './detalle-renta.component.html',
  styleUrl: './detalle-renta.component.css'
})
export default class DetalleRentaComponent {
  reservationId!: number;
  reservationDetails: any;
  isLoading = true;
  today: Date = new Date();
  todayDate: string;

  
  constructor(
    private route: ActivatedRoute,
    private reservationService: ReservationsService
  ) {
    // Obtener la fecha actual en formato YYYY-MM-DD
    const today = new Date();
    this.todayDate = today.toISOString().split('T')[0];  // Asignación dentro del constructor
  }

  ngOnInit(): void {
    // Get today's date in YYYY-MM-DD format
    const today = new Date();
    this.todayDate = today.toISOString().split('T')[0]; // Format date to YYYY-MM-DD

    // Get the 'id_reserva' parameter from the URL and fetch reservation details
    this.route.params.subscribe((params) => {
      this.reservationId = +params['id_reserva']; // Convert 'id_reserva' to a number
      this.fetchReservationDetails(); // Fetch details for the reservation
    });
  }


// Función para verificar si la fecha es diciembre de este año o posterior
isDateValid(date: string): boolean {
  const reservationDate = new Date(date); // Convertir la fecha de la reserva en un objeto Date
  const today = new Date(); // Fecha actual
  const currentYear = today.getFullYear(); // Obtener el año actual
  
  // Asegurarse de que la fecha sea diciembre del año actual o posterior
  if (reservationDate.getFullYear() > currentYear) {
    return true; // Fechas de años futuros son válidas
  }
  
  // Si es el mismo año, verificar si es diciembre o después
  if (reservationDate.getFullYear() === currentYear && reservationDate.getMonth() >= 11) {
    return true; // Es diciembre o más tarde
  }

  return false; // Si la fecha no es válida (antes de diciembre de este año)
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
