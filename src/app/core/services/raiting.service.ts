import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

export interface Review {
nombre_usuario: any;
  id_valoracion: number;
  id_carro: number;
  id_usuario: number;
  valoracion: number;
  comentario: string;
  fecha_valoracion?: string;
}

interface RatingsResponse {
  data: Review[]; // Aquí, `Review[]` es el array de reseñas que ya tienes definido
}



const API_URL = 'http://localhost:3500/valoracion';

@Injectable({
  providedIn: 'root',
})
export class RatingService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  private checkAuthentication(): boolean {
    return this.authService.isAuthenticated();
  }

  // Crear una nueva valoración
  createRating(id_carro: number, valoracion: number, comentario: string): Observable<Review> {
    if (!this.checkAuthentication()) {
      console.error('Usuario no autenticado');
      return throwError(() => new Error('Usuario no autenticado'));
    }
  
    const id_usuario = this.authService.getUserId();  // Obtén el ID del usuario
    const body = { id_carro, id_usuario, valoracion, comentario };
  
    console.log('Datos enviados para la valoración:', body); // Log de los datos enviados
  
    return this.http
      .post<Review>(API_URL, body, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError),
        tap(response => {
          console.log('Respuesta del servidor:', response);  // Ver la respuesta del servidor
        })
      );
  }
  
  
  private handleError(error: any) {
    let errorMessage = 'Ha ocurrido un error desconocido';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Código de error: ${error.status}, Mensaje: ${error.message}`;
      console.error('Detalles del error:', error);  // Verifica el detalle completo del error
      if (error.error) {
        console.error('Respuesta del servidor:', error.error);  // Esto te ayudará a ver la respuesta completa
      }
    }
    return throwError(() => new Error(errorMessage));
  }
  
  getAllRatings(): Observable<any[]> {
    return this.http
      .get<RatingsResponse>(API_URL, { headers: this.getHeaders() }) // Obtener todas las valoraciones
      .pipe(
        map((ratingsResponse: RatingsResponse) => ratingsResponse.data), // Extraer las valoraciones en un array
        catchError(this.handleError) // Manejamos errores directamente en el flujo de la solicitud
      );
  }
  
  
  

  // Obtener una valoración por ID
  getRatingById(id: number): Observable<Review> {
    if (!this.checkAuthentication()) {
      return throwError(() => new Error('Usuario no autenticado'));
    }

    return this.http
      .get<Review>(`${API_URL}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Actualizar una valoración
  updateRating(id: number, id_carro: number, valoracion: number, comentario: string): Observable<Review> {
    if (!this.checkAuthentication()) {
      return throwError(() => new Error('Usuario no autenticado'));
    }

    const id_usuario = this.authService.getUserId();  // Ensure user ID is passed
    const body = { id_carro, id_usuario, valoracion, comentario };
    return this.http
      .put<Review>(`${API_URL}/${id}`, body, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Eliminar una valoración por ID
  deleteRating(id: number): Observable<any> {
    if (!this.checkAuthentication()) {
      return throwError(() => new Error('Usuario no autenticado'));
    }

    return this.http
      .delete(`${API_URL}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  
}
