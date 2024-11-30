import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReviewsComponent } from '../../components/reviews/reviews.component';
import { AuthService } from '../../core/services/auth.service';
import { Car, CarrosService } from '../../core/services/carros.service';
import { ReservationsService } from '../../core/services/reservations.service';

import Swal from 'sweetalert2';

import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-detalle-carro',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    FormsModule,
    ReviewsComponent,
  ],
  templateUrl: './detalle-carro.component.html',
  styleUrls: ['./detalle-carro.component.css'],
})
export default class DetalleCarroComponent implements OnInit {
  car?: Car;
  reviews: { user: string; comment: string }[] = [];
  relatedCars: Car[] = [];
  loading: boolean = true;
  errorMessage: string | null = null;

  selectedRentTypeId: number | null = null;
  startDate: string = '';
  endDate: string = '';
  todayDate: string = new Date().toISOString().split('T')[0];
  userId: number | null = null;
  isAuthenticated: boolean = false;
  selectedRentType: string = '';  
  rentalTypes: string[] = [];   
  totalPrice: number = 0;
  dailyPrice: number = 0;

  constructor(
    private route: ActivatedRoute,
    private carrosService: CarrosService,
    private router: Router,
    private authService: AuthService,
    private reservationsService: ReservationsService
  ) {}

  ngOnInit(): void {
    // Verificar si el usuario está autenticado
    this.isAuthenticated = this.authService.isAuthenticated(); // Método de servicio para verificar autenticación
  
    if (this.isAuthenticated) {
      this.userId = this.authService.getUserId(); // Obtener ID del usuario logueado
      console.log('Usuario logueado con ID:', this.userId);
    } else {
      console.log('Usuario no autenticado.');
    }
  
    // Obtener el ID del carro desde la URL
    const carId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Car ID extraído de la URL:', carId);
  
    if (!isNaN(carId)) {
      this.loadCarData(carId);
    } else {
      this.setError('ID de carro no válido');
    }
    
    this.getReservationTypes();
  }

  createReservation(): void {
    // Verificar si el usuario está autenticado antes de proceder
    if (!this.isAuthenticated) {
      this.showLoginRequiredMessage(); // Mostrar mensaje si no está logueado
      return;
    }

    const missingData: string[] = [];
    
    // Validar la selección del tipo de renta
    if (!this.selectedRentType) {
      missingData.push('Tipo de renta');
    }

    if (missingData.length > 0) {
      this.showError('Faltan datos: ' + missingData.join(', '));
      return;
    }

    // Validar fechas y otros campos
    if (!this.startDate || !this.endDate) {
      this.showError('Las fechas de inicio y fin son necesarias');
      return;
    }

    // Prevenir la renta con fechas pasadas
    const currentDate = new Date();
    const startDateObj = new Date(this.startDate);
    if (startDateObj < currentDate) {
      this.showError('La fecha de inicio no puede ser en el pasado');
      return;
    }

    if (this.startDate > this.endDate) {
      this.showError('La fecha de inicio no puede ser posterior a la fecha de fin.');
      return;
    }

    // Preparar los datos de la reserva
    const reservationData = {
      id_reserva: 0, // Autogenerado en la base de datos
      id_usuario: this.userId,
      id_carro: this.car?.id, // ID del carro
      fecha_inicio: this.startDate,
      fecha_fin: this.endDate,
      estado_reserva: 'Pendiente',
      monto_reserva: this.totalPrice,
      tipo_reserva: this.selectedRentType, // Tipo de renta
    };

    // Crear la reserva a través del servicio
    this.reservationsService.createReservation(reservationData).subscribe({
      next: (response) => {
        this.showSuccess('Reserva creada con éxito');
      },
      error: (error: HttpErrorResponse) => {
        if (error.message === 'Este carro ya está rentado o tiene una renta activa. No se puede realizar una nueva reserva.') {
          // Mostrar SweetAlert para este error específico
          Swal.fire({
            icon: 'error',
            title: '¡Error!',
            text: 'Este carro ya está rentado o tiene una renta activa. No se puede realizar una nueva reserva.',
          });
        } else {
          // Mostrar otros errores
          this.showError(error.message);
        }
      },
    });
  }

  // Función para mostrar mensaje de error genérico
  showError(message: string): void {
    Swal.fire({
      icon: 'error',
      title: '¡Error!',
      text: message,
    });
  }

  // Función para mostrar mensaje de éxito
  showSuccess(message: string): void {
    Swal.fire({
      icon: 'success',
      title: 'Éxito',
      text: message,
    });
  }

  // Función para mostrar mensaje cuando el usuario no está autenticado
  showLoginRequiredMessage(): void {
    Swal.fire({
      icon: 'warning',
      title: '¡Atención!',
      text: 'Es necesario iniciar sesión para realizar una reserva.',
    });
  }
// Handle date change for start date
onStartDateChange(): void {
  console.log('Start date changed to:', this.startDate);
  this.calculateTotalPrice(this.dailyPrice);
}

// Handle date change for end date
onEndDateChange(): void {
  console.log('End date changed to:', this.endDate);
  this.calculateTotalPrice(this.dailyPrice);
}

   // Method to calculate the total price based on start and end dates
   calculateTotalPrice(updatedDailyPrice: number): void {
    if (this.startDate && this.endDate) {
      // Convert the dates to Date objects
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);

      // Set the time to 00:00:00 to compare only dates
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      // Calculate the difference in time
      const timeDiff = end.getTime() - start.getTime();

      // Convert the difference to days
      let days = timeDiff / (1000 * 3600 * 24);

      // If dates are the same, consider it as 1 day
      if (days <= 0) {
        days = 1;
      }

      this.totalPrice = updatedDailyPrice * days;
      console.log('Total rental price:', this.totalPrice);
    } else {
      this.totalPrice = 0;
      console.error('Start and end dates are required for calculating total price.');
    }
  }

  // Method to update the price based on the selected rental type
  updatePriceByType(): void {
    if (this.selectedRentType === 'Recurrente') {
      this.totalPrice = this.dailyPrice * 0.9 * (new Date(this.endDate).getTime() - new Date(this.startDate).getTime()) / (1000 * 3600 * 24); // 10% discount
    } else if (this.selectedRentType === 'Ejecutivo') {
      this.totalPrice = this.dailyPrice * 1.2 * (new Date(this.endDate).getTime() - new Date(this.startDate).getTime()) / (1000 * 3600 * 24); // 20% markup
    } else {
      this.totalPrice = this.dailyPrice * (new Date(this.endDate).getTime() - new Date(this.startDate).getTime()) / (1000 * 3600 * 24); // Normal rate
    }
  }

  private loadCarData(id: number): void {
    this.loading = true;
    this.carrosService.getCarro(id).subscribe({
      next: (data) => this.handleCarDataResponse(data),
      error: (error) => this.handleError(error, 'No se pudo cargar el carro'),
    });
  }

  private handleCarDataResponse(data: any): void {
    if (Array.isArray(data) && data.length > 0) {
      const carData = data[0];
      const {
        marca,
        modelo,
        imagen,
        descripcion,
        anio,
        precio_diaro,
        reviews,
        relatedCars,
      } = carData;

      if (marca && modelo && descripcion && anio && precio_diaro) {
        const imageUrl = imagen ? `http://localhost:3500/${imagen}` : null;
        const precioDiarioNumero = parseFloat(precio_diaro);

        if (isNaN(precioDiarioNumero)) {
          this.setError('El precio diario no es un número válido');
        } else {
          this.car = {
            ...carData,
            imagen: imageUrl,
            precio_diaro: precioDiarioNumero,
            precio_base: precioDiarioNumero,
          };
          this.reviews = reviews || [];
          this.relatedCars = relatedCars || [];
          this.errorMessage = null;
          this.dailyPrice = precioDiarioNumero;  // Set the daily price for future calculations
        }
      } else {
        this.setError('Datos del carro incompletos o no válidos');
      }
    } else {
      this.setError('No se encontraron datos del carro');
    }
    this.loading = false;
  }

  private handleError(error: any, defaultMessage: string): void {
    this.errorMessage = error.message || defaultMessage;
    this.loading = false;
  }

  private setError(message: string): void {
    this.errorMessage = message;
    this.loading = false;
  }

  getReservationTypes(): void {
    this.reservationsService.getReservationTypes().subscribe({
      next: (types) => {
        this.rentalTypes = types;
      },
      error: (error) => {
        console.error('Error fetching rent types:', error);
      }
    });
  }

  // Handle rent type selection change
  onRentTypeChange(): void {
    console.log('Selected Rent Type:', this.selectedRentType);
  }

  // Navigation functions
  viewCarDetails(id: number): void {
    this.router.navigate([`/carros/${id}`]);
  }

  goBack(): void {
    this.router.navigate(['/carros']);
  }
}
