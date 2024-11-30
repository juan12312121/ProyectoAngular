import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2'; // Importar SweetAlert2
import { ReservationsService } from '../../core/services/reservations.service';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-vista-pago',
  standalone: true,
  imports: [NavbarComponent, CommonModule, FormsModule],
  templateUrl: './vista-pago.component.html',
  styleUrls: ['./vista-pago.component.css']
})
export default class VistaPagoComponent implements OnInit {
  numeroTarjeta: string = '';
  vencimiento: any;
  cvv: any;
  reservaId: number = 0;
  reservaDetails: any = null;
  isLoading: boolean = false;
  errorMessage: string = '';
  metodoPago: string = 'paypal';
  fechaPago: string = '';

  constructor(
    private reservasService: ReservationsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.reservaId = +params['id_reserva'];
      console.log('ID de reserva obtenido:', this.reservaId);
      this.getReservaDetails();
    });
  }

  // Obtener los detalles de la reserva
  getReservaDetails(): void {
    this.isLoading = true;
    this.reservaDetails = null;
    this.errorMessage = '';

    this.reservasService.getReservationDetails(this.reservaId).subscribe(
      (data) => {
        this.isLoading = false;
        this.reservaDetails = data;
      },
      (error: HttpErrorResponse) => {
        this.isLoading = false;
        this.handleError(error);
      }
    );
  }

  // Manejo de errores
  handleError(error: HttpErrorResponse): void {
    if (error.status === 0) {
      this.errorMessage = 'Error de conexión. Revisa tu conexión a Internet.';
    } else if (error.status === 404) {
      this.errorMessage = 'Reserva no encontrada.';
    } else if (error.status === 500) {
      this.errorMessage = 'Error en el servidor. Inténtalo más tarde.';
    } else {
      this.errorMessage = error.message || 'Error al obtener los detalles de la reserva.';
    }
  }

  // Validación de número de tarjeta de crédito (solo longitud)
  validateCreditCardNumber(): boolean {
    const regex = /^\d{16}$/; // Solo permite 16 dígitos
    return regex.test(this.numeroTarjeta);
  }

  // Método para realizar el pago
  pagarReserva(): void {
    if (!this.reservaDetails) {
      this.errorMessage = 'Los detalles de la reserva no están disponibles.';
      return;
    }
  
    const montoReserva = this.reservaDetails?.monto_reserva;
  
    if (!montoReserva || !this.metodoPago) {
      this.errorMessage = 'Faltan datos importantes para realizar el pago.';
      return;
    }
  
    // Validación del número de tarjeta de crédito
    if (this.metodoPago === 'Tarjeta de Crédito' && !this.validateCreditCardNumber()) {
      this.errorMessage = 'El número de tarjeta de crédito debe tener 16 dígitos.';
      return;
    }
  
    this.fechaPago = new Date().toISOString();  // Fecha actual
  
    // Cambiar 'metodo_pago' por 'tipo'
    const paymentData = {
      monto: montoReserva,
      tipo: this.metodoPago,  // Cambié 'metodo_pago' por 'tipo'
      fecha_pago: this.fechaPago,
      reserva_id: this.reservaId
    };
  
    console.log('Datos de pago:', paymentData);
  
    this.reservasService.createPayment(paymentData).subscribe(
      (response) => {
        console.log('Pago realizado con éxito:', response);
        
        // Mostrar SweetAlert2 de éxito
        Swal.fire({
          icon: 'success',
          title: 'Pago realizado con éxito',
          text: 'Tu pago ha sido procesado exitosamente.',
          confirmButtonText: 'Aceptar'
        });
  
        // Redirigir o mostrar mensaje de éxito
        // Ejemplo: this.router.navigate(['/gracias']);
      },
      (error) => {
        console.error('Error al procesar el pago:', error);
        this.errorMessage = 'Hubo un error al procesar el pago.';
      }
    );
  }

  // Regresar a la lista de reservas
  regresar() {
    window.history.back();
  }

  pagarConPayPal(): void {
    if (!this.reservaDetails) {
      this.errorMessage = 'Los detalles de la reserva no están disponibles.';
      console.log('Faltan detalles de la reserva:', this.reservaDetails);  // Log para verificar los detalles de la reserva
      return;
    }
  
    const montoReserva = this.reservaDetails?.monto_reserva;
  
    if (!montoReserva || !this.metodoPago) {
      this.errorMessage = 'Faltan datos importantes para realizar el pago.';
      console.log('Datos faltantes para el pago:', { montoReserva, metodoPago: this.metodoPago });  // Log para verificar los datos faltantes
      return;
    }
  
    // Validación del monto
    if (montoReserva <= 0) {
      this.errorMessage = 'El monto de la reserva no es válido.';
      console.log('Monto inválido para la reserva:', montoReserva);  // Log para verificar el monto
      return;
    }
  
    this.fechaPago = new Date().toISOString(); // Fecha actual
    console.log('Fecha de pago:', this.fechaPago);  // Log para verificar la fecha de pago
    
    const paymentData = {
      monto: montoReserva,
      metodo_pago: 'PayPal',  // Usar 'PayPal' en lugar de 'paypal'
      fecha_pago: this.fechaPago,
      reserva_id: this.reservaId
    };
  
    console.log('Datos de pago para PayPal:', paymentData);  // Log para verificar todos los datos que se están enviando
  
    // Llamar a la API para crear el pago con PayPal
    this.reservasService.createPaymentpaypal(paymentData).subscribe(
      (response) => {
        console.log('Pago creado con éxito:', response);
  
        // Verificar si la respuesta contiene un enlace de aprobación
        if (response && response.approval_url) {
          const approvalUrl = response.approval_url; // Extraemos la URL de aprobación
  
          // Intentar abrir una ventana emergente con la URL de PayPal
          const popupWindow = window.open(approvalUrl, 'PayPal Payment', 'width=600,height=600,scrollbars=yes');
  
          // Verifica si la ventana emergente se abrió correctamente
          if (!popupWindow) {
            // Si la ventana emergente fue bloqueada, redirigir al usuario a la URL de PayPal
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo abrir la ventana emergente. Redirigiendo a PayPal...',
            });
  
            // Redirigir directamente a la URL de aprobación
            window.location.href = approvalUrl;
          }
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'La respuesta de PayPal no contiene la URL de aprobación.',
          });
        }
      },
      (error) => {
        console.error('Error al crear el pago con PayPal:', error);
        this.errorMessage = 'Hubo un error al procesar el pago con PayPal.';
      }
    );
  }
  


  

}
