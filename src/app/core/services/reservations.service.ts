import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ReservationsService {
  assignDriver(reservationId: number, choferSeleccionadoId: number) {
    throw new Error('Method not implemented.');
  }
 
  private apiUrl = 'http://localhost:3500/reservas';  // API URL
  private apipago = 'http://localhost:3500/pago';
  private apiPaypal = 'http://localhost:3500/execute';
  private verpagos = 'http://localhost:3500/pago/ver-pagos';

 
  private reservationUpdatedSubject = new Subject<void>();

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Obtener encabezados de autorización
  private getAuthHeaders(): HttpHeaders {
    if (!this.authService.isTokenValid()) {
      throw new Error('El token ha expirado o el usuario no está autenticado');
    }

    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  verPagos(): Observable<any> {
    const headers = this.getAuthHeaders();  // Método para obtener los headers con el token
    
    // Realizamos la solicitud GET con los headers y especificamos que la respuesta es JSON
    return this.http.get<any>(`${this.verpagos}/`, { headers });
  }

    createPaymentpaypal(paymentData: { monto: any, metodo_pago: string, fecha_pago: string, reserva_id: number }): Observable<any> {
      // Aquí no necesitas redefinir paymentData, solo asigna los valores necesarios.
      paymentData.fecha_pago = new Date().toISOString();  // Asignar la fecha actual.
      
      // Ahora hacemos la solicitud HTTP con el paymentData actualizado.
      return this.http.post<any>(`${this.apipago}/create-paypal-payment`, paymentData);
    }
  



  createPayment(data: any): Observable<any> {
    // Verifica que los datos del pago sean válidos
    if (!data) {
      console.error('Los datos del pago están vacíos.');
      return throwError(() => new Error('Los datos del pago son necesarios.'));
    }
  
    // Verifica si falta algún dato específico
    if (!data.monto) {
      console.error('Falta el monto en los datos del pago.');
    }
    if (!data.tipo) {
      console.error('Falta el tipo de pago (por ejemplo, PayPal, tarjeta de crédito).');
    }
    if (!data.fecha_pago) {
      console.error('Falta la fecha de pago.');
    }
    if (!data.reserva_id) {
      console.error('Falta el ID de la reserva.');
    }
  
    // Si todo está presente, logueamos los datos que se van a enviar
    console.log('Datos del pago:', data);
  
    return this.http
      .post<any>(this.apipago, data, {
        headers: this.getAuthHeaders(),  // Agrega los encabezados de autenticación
      })
      .pipe(
        catchError((error) => {
          console.error('Error al crear el pago:', error);
          return throwError(() => new Error(error.message || 'Error al crear el pago.'));
        })
      );
  }
  


  getReservationDetails(id: number): Observable<any> {
    // Usamos el parámetro 'id' directamente, no 'id_reserva'
    const url = `${this.apiUrl}/reservas/${id}`;  // Asegúrate de que el parámetro sea 'id', que es el que pasas a la función
    const headers = this.getAuthHeaders();  // Obtenemos los headers con el token
  
    // Realizamos la solicitud GET con los headers, especificando que la respuesta es en formato JSON
    return this.http.get<any>(url, { headers, responseType: 'json' });
  }
  




  updateDeliveryStatus(reservationId: number, deliveryStatus: string): Observable<any> {
    if (!reservationId || !deliveryStatus) {
      return throwError(() => new Error('El ID de la reserva y el estado de la entrega son necesarios.'));
    }
  
    console.log(`Actualizando estado de entrega de la reserva con ID: ${reservationId} a ${deliveryStatus}`);

    // Llamada a la API para actualizar el estado de entrega
    return this.http
      .put<any>(
        `${this.apiUrl}/reserva/${reservationId}/cambiar-estado`, // Endpoint para actualizar el estado
        { entrega: deliveryStatus }, // Cuerpo de la solicitud con el nuevo estado de entrega
        { headers: this.getAuthHeaders() } // Encabezados con el token de autenticación
      )
      .pipe(
        tap((response) => {
          console.log(`Estado de entrega de la reserva ${reservationId} actualizado con éxito:`, response);
        }),
        catchError((error) => {
          console.error(`Error al actualizar el estado de entrega de la reserva ${reservationId}:`, error);
          return throwError(() => new Error('Error al actualizar el estado de entrega de la reserva.'));
        })
      );
  }




  getReservationsByDriver(id: number): Observable<any[]> {
    if (!id) {
      return throwError(() => new Error('El ID del chofer es obligatorio.'));
    }
  
    console.log(`Obteniendo reservas para el chofer con ID: ${id}`);
  
    // URL modificada a /chofer/:id
    const url = `${this.apiUrl}/chofer/${id}`;
  
    return this.http
      .get<any[]>(url, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        tap((reservations) => {
          console.log(`Reservas obtenidas para el chofer con ID ${id}:`, reservations);
        }),
        catchError((error) => {
          console.error(`Error al obtener las reservas para el chofer con ID ${id}:`, error);
          return throwError(() => new Error('Error al obtener las reservas.'));
        })
      );
  }
  




  assignDriverToReservation(reservationId: number, driverId: number): Observable<any> {
    // Verifica si los IDs son válidos
    if (!reservationId || !driverId) {
      return throwError(() => new Error('El ID de la reserva y el ID del chofer son necesarios.'));
    }
  
    console.log(`Asignando chofer con ID: ${driverId} a la reserva con ID: ${reservationId}`);
  
    // Crea el cuerpo de la solicitud
    const body = {
      id_chofer: driverId  // Cambiado a 'id_chofer' para coincidir con lo que espera el backend
    };
  
    // Obtén los encabezados de autenticación
    let headers = this.getAuthHeaders();
    headers = headers.set('Content-Type', 'application/json');  // Asegúrate de que se envíe como JSON
  
    // Realiza la solicitud PUT al backend
    return this.http
      .put<any>(
        `${this.apiUrl}/${reservationId}/asignar`,  // Asegúrate de que la URL esté bien formada
        body,
        { headers }  // Los encabezados correctos con el token
      )
      .pipe(
        tap((response) => {
          console.log(`Chofer asignado con éxito a la reserva ${reservationId}:`, response);
          this.reservationUpdatedSubject.next();  // Notifica que la reserva ha sido actualizada
        }),
        catchError((error) => {
          // Manejo del error con más detalles
          console.error(`Error al asignar chofer a la reserva ${reservationId}:`, error);
          return throwError(() => new Error(error.message || 'Error al asignar chofer a la reserva.'));
        })
      );
  }
  
  
  


  acceptReservation(reservationId: number): Observable<any> {
    if (!reservationId) {
      return throwError(() => new Error('El ID de la reserva es necesario.'));
    }
  
    console.log(`Aceptando reserva con ID: ${reservationId}`); // Log para depuración
  
    return this.http
      .put<any>(
        `${this.apiUrl}/${reservationId}/aceptar`, // Endpoint para aceptar la reserva
        null, // Cuerpo de la solicitud, puede ser null si no se requiere información adicional
        { headers: this.getAuthHeaders() } // Encabezados de autenticación
      )
      .pipe(
        tap((response) => {
          console.log(`Reserva ${reservationId} aceptada con éxito:`, response);
          // Emitir el cambio para notificar a los suscriptores
          this.reservationUpdatedSubject.next();
        }),
        catchError((error) => {
          console.error(`Error al aceptar la reserva ${reservationId}:`, error);
          return throwError(() => new Error('Error al aceptar la reserva.'));
        })
      );
  }
  

  // Crear una reserva
  createReservation(data: any): Observable<any> {
    const userId = this.getUserId();
    if (!userId) {
      return throwError(() => new Error('Usuario no autenticado.'));
    }

    return this.http
      .post<any>(`${this.apiUrl}/`, data, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        catchError((error) => {
          console.error('Error al crear la reserva:', error);
          return throwError(() => new Error(error.message || 'Error al crear la reserva.'));
        })
      );
  }


  // Obtener los tipos de reserva
  getReservationTypes(): Observable<string[]> {
    return this.http
      .get<string[]>(`${this.apiUrl}/tipos-reservas`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Obtener todas las reservas
  getAllReservations(page: number, pageSize: number): Observable<any[]> {
    const params = {
      page: page.toString(),
      pageSize: pageSize.toString()
    };
    return this.http
      .get<any[]>(`${this.apiUrl}/`, { headers: this.getAuthHeaders(), params })
      .pipe(catchError(this.handleError));
  }

  // Obtener una reserva por ID
  getReservationById(reservationId: number): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/${reservationId}`, { headers: this.getAuthHeaders() })
      .pipe(
        tap((reservation) => console.log('Reserva obtenida:', reservation)),
        catchError(this.handleError)
      );
  }

  getReservationsByUserId(userId: number): Observable<any[]> {
    if (!userId) {
      return throwError(() => new Error('El ID de usuario es necesario.'));
    }
  
    console.log(`Haciendo request para obtener reservas del usuario: ${userId}`);
    
    return this.http
      .get<any[]>(`${this.apiUrl}/usuario/${userId}`, {
        headers: this.getAuthHeaders(), // Asegúrate de que los encabezados de autenticación son correctos
      })
      .pipe(
        tap((reservations) => {
          console.log(`Reservas obtenidas para el usuario ${userId}:`, reservations); // Log de las reservas obtenidas
        }),
        catchError((error) => {
          console.error(`Error al obtener las reservas para el usuario ${userId}:`, error);
          return throwError(() => new Error('Error al obtener las reservas.'));
        })
      );
  }


  // Actualizar el estado de la reserva
  updateReservationStatus(reservationId: number, status: string): Observable<any> {
    const body = { estado_reserva: status };

    return this.http
      .put<any>(`${this.apiUrl}/${reservationId}`, body, { headers: this.getAuthHeaders() })
      .pipe(
        tap((updatedReservation) => console.log('Estado de la reserva actualizado:', updatedReservation)),
        catchError(this.handleError)
      );
  }

  // Eliminar una reserva
  deleteReservation(reservationId: number): Observable<any> {
    return this.http
      .delete<any>(`${this.apiUrl}/${reservationId}`, { headers: this.getAuthHeaders() })
      .pipe(
        tap(() => console.log(`Reserva con ID: ${reservationId} eliminada`)),
        catchError(this.handleError)
      );
  }

  // Manejo de errores
  private handleError(error: any): Observable<never> {
    let message: string;
    console.error('Ocurrió un error en la solicitud HTTP:', error);

    if (error.error instanceof ErrorEvent) {
      message = `Error del cliente: ${error.error.message}`;
    } else {
      message = `Error del servidor - Código: ${error.status}, Mensaje: ${error.message}`;
    }

    console.error('Error completo:', message);
    return throwError(() => new Error(message || 'Algo salió mal; por favor intente de nuevo más tarde.'));
  }

  // Obtener el userId desde el almacenamiento local
  private getUserId(): string | null {
    return localStorage.getItem('userId');
  }
  



  cancelReservation(reservationId: number): Observable<any> {
    if (!reservationId) {
      return throwError(() => new Error('El ID de la reserva es necesario.'));
    }

    console.log(`Cancelando reserva con ID: ${reservationId}`); // Log para depuración

    return this.http
      .put<any>(
        `${this.apiUrl}/${reservationId}/cancelar`, // Endpoint actualizado para cancelar la reserva
        null, // Puedes enviar un cuerpo si tu API lo requiere
        { headers: this.getAuthHeaders() }
      )
      .pipe(
        tap((response) => {
          console.log(`Reserva ${reservationId} cancelada con éxito:`, response);
          // Emitir el cambio para notificar a los suscriptores
          this.reservationUpdatedSubject.next();
        }),
        catchError((error) => {
          console.error(`Error al cancelar la reserva ${reservationId}:`, error);
          return throwError(() => new Error('Error al cancelar la reserva.'));
        })
      );
  }


  getReservationUpdatedSubject() {
    return this.reservationUpdatedSubject.asObservable();
  }
  
}
