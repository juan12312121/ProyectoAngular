import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { CarrosService } from '../../core/services/carros.service';
import { ReservationsService } from '../../core/services/reservations.service';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [NavbarComponent, CommonModule],
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export default class HistorialComponent implements OnInit {
  public reservations: any[] = []; // Array de reservas
  public completedReservations: any[] = []; // Reservas completadas
  public recentReservations: any[] = []; // Reservas recientes
  public carImages: { [key: string]: string } = {}; // Diccionario para almacenar imágenes
  public loadingImage: boolean = false; // Variable para manejar el estado de carga de las imágenes

  constructor(
    private authService: AuthService, // Servicio de autenticación
    private reservationsService: ReservationsService, // Servicio de reservas
    private carrosService: CarrosService // Servicio de carros
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getUserId(); // Obtener ID del usuario logueado
    console.log('User ID:', userId);  // Log para verificar si el ID del usuario es correcto
    
    if (userId) {
      this.reservationsService.getReservationsByUserId(userId).subscribe({
        next: (reservations) => {
          console.log('Reservations:', reservations); // Log para ver las reservas que devuelve el servicio
          this.reservations = reservations; // Asignar las reservas a la variable
          this.filterReservations();
          this.loadCarImages(); // Cargar imágenes de los carros
        },
        error: (error) => {
          console.error('Error al obtener las reservas:', error); // Log para el error en la obtención de reservas
        }
      });
    } else {
      console.error('No se pudo obtener el ID del usuario'); // Log si no se pudo obtener el ID del usuario
    }
  }

  filterReservations(): void {
    console.log('All Reservations:', this.reservations); // Log para ver todas las reservas antes del filtrado
    
    this.recentReservations = this.reservations.filter(reservation =>
      reservation.estado_reserva === 'Pendiente'
    );
    this.completedReservations = this.reservations.filter(reservation =>
      reservation.estado_reserva === 'Completada'
    );

    console.log('Recent Reservations:', this.recentReservations); // Log para ver las reservas recientes
    console.log('Completed Reservations:', this.completedReservations); // Log para ver las reservas completadas
  }

  loadCarImages() {
    this.recentReservations.forEach(reservation => {
      this.carrosService.getCarro(reservation.id_carro).subscribe(car => {
        let imageUrl = car.imagen?.replace(/\\/g, '/').replace(/^\/+/, '');
        // Si la imagen existe, la asignamos, sino, asignamos la imagen predeterminada
        this.carImages[reservation.id_carro] = imageUrl
          ? `http://localhost:3500/${imageUrl}`
          : 'http://localhost:3500/uploads/ruta/a/imagen/predeterminada.jpg';
      });
    });
  }

  // Función que obtiene la URL de la imagen de un carro
  getCarImage(id_carro: number): string {
    return this.carImages[id_carro] || 'http://localhost:3500/uploads/';
  }
}
