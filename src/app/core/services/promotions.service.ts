import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PromotionsService {

  // URL del backend (asegúrate de que sea la URL correcta)
  private apiUrl = 'http://localhost:3500/promociones'; 

  // Constructor con HttpClient y AuthService inyectados
  constructor(private http: HttpClient, private authService: AuthService) {}

  // Obtener encabezados de autorización con el token
  private getAuthHeaders(): HttpHeaders {
    if (!this.authService.isTokenValid()) {
      throw new Error('El token ha expirado o el usuario no está autenticado');
    }

    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  // Crear una nueva promoción
  createPromotion(
    codigo_promocion: string,
    descripcion: string,
    descuento: number,
    fecha_inicio: string,
    fecha_fin: string
  ): Observable<any> {
    const body = { codigo_promocion, descripcion, descuento, fecha_inicio, fecha_fin };
    return this.http.post<any>(this.apiUrl, body, { headers: this.getAuthHeaders() });
  }

  // Obtener todas las promociones con paginación
  getAllPromotions(page: number, limit: number): Observable<any[]> {
    const url = `${this.apiUrl}?page=${page}&limit=${limit}`;
    return this.http.get<any[]>(url, { headers: this.getAuthHeaders() });
  }

  // Obtener una promoción por su ID
  getPromotionById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  // Actualizar una promoción existente
  updatePromotion(
    id: number,
    codigo_promocion: string,
    descripcion: string,
    descuento: number,
    fecha_inicio: string,
    fecha_fin: string
  ): Observable<any> {
    const body = { codigo_promocion, descripcion, descuento, fecha_inicio, fecha_fin };
    return this.http.put<any>(`${this.apiUrl}/${id}`, body, { headers: this.getAuthHeaders() });
  }

  // Eliminar una promoción por ID
  deletePromotion(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  // Aplicar una promoción a un carro
  applyPromotionToCar(idCarro: number, idPromocion: number): Observable<any> {
    const url = `http://localhost:3000/api/promotions/apply/${idCarro}/${idPromocion}`; // Ruta del backend para aplicar promoción
    return this.http.put<any>(url, {}, { headers: this.getAuthHeaders() });
  }
  updatePromotionStatus(id: number, status: string): Observable<any> {
    const body = { estado: status }; // Estado recibido en el cuerpo de la solicitud
    console.log('Actualizando promoción con ID:', id); // Verificación del ID
    console.log('Nuevo estado:', status); // Verificación del estado

    return this.http.put<any>(`${this.apiUrl}/update-status/${id}`, body, { headers: this.getAuthHeaders() })
        .pipe(
            catchError((error) => {
                console.error('Error al actualizar promoción:', error);
                return throwError(error); // Retornar el error para que pueda ser gestionado en el servicio
            })
        );
}


// Método para manejar los errores
private handleError(error: any): Observable<never> {
  // Puedes realizar un log o tratar de mostrar un mensaje de error
  console.error('Error en la actualización de estado:', error);
  return throwError(() => new Error(error.message || 'Error inesperado'));
}

}
