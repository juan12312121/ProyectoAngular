import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ReservationsService {
  cancelReservation(reservationId: number) {
    throw new Error('Method not implemented.');
  }
  private apiUrl = 'http://localhost:3500/reservas';  // API URL

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
  getAllReservations(): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.apiUrl}/`, { headers: this.getAuthHeaders() })
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
}
