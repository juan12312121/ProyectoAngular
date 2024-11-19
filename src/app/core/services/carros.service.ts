import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { AuthService } from './auth.service';


export interface Car {
  id: number;
  marca: string;
  modelo: string;
  anio: number;
  color: string;
  tipo_combustible: string;
  precio_diaro: number;
  disponibilidad: string;
  categoria: string;
  descripcion: string;
  kilometraje: number;
  imagen: string;
  puertas: number;
  pasajeros: number;
  reviews: { user: string; comment: string }[];  // Propiedad de comentarios o reseñas
  relatedCars: Car[];  // Autos relacionados
}

@Injectable({
  providedIn: 'root',
})
export class CarrosService {
  getAllRentalTypes() {
    throw new Error('Method not implemented.');
  }
  private apiUrl = 'http://localhost:3500/carros';
  public carAddedSignal = signal<boolean>(false); 

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('Token no encontrado');
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
  }

  // Obtener todos los carros para admins
  getAllCarsAdmin(): Observable<Car[]> {
    return this.http.get<Car[]>(this.apiUrl, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Subir imagen de carro
  uploadCarImage(formData: FormData): Observable<any> {
    return this.http.post<any>('http://localhost:3500/upload', formData)
      .pipe(catchError(this.handleError));
  }

  // Obtener carros visibles para usuarios (no requiere autenticación)
  getUserCars(): Observable<Car[]> {
    return this.http.get<Car[]>(`${this.apiUrl}/usuario`)
      .pipe(catchError(this.handleError));
  }

  // Añadir un nuevo carro
  addCarro(formData: FormData): Observable<Car> {
    return this.http.post<Car>(this.apiUrl, formData, { headers: this.getAuthHeaders() })
      .pipe(
        tap(() => this.carAddedSignal.set(true)),
        catchError(this.handleError)
      );
  }

  saveCarIdToLocalStorage(id: number): void {
    localStorage.setItem('selectedCarId', id.toString());
  }
  

getCarIdFromLocalStorage(): number | null {
  const carId = localStorage.getItem('selectedCarId');
  return carId && !isNaN(parseInt(carId, 10)) ? parseInt(carId, 10) : null;
}

  getCarro(id: number): Observable<Car> {
    if (isNaN(id) || id <= 0) {
      console.error('ID de carro inválido:', id);
      return throwError(() => new Error('ID de carro no válido'));
    }
  
    const headers = this.getAuthHeaders();  // Si se necesita cabecera de autenticación
    return this.http.get<Car>(`${this.apiUrl}/${id}`, { headers: headers || undefined })
      .pipe(
        tap((carro: Car) => {
          console.log('Carro recibido:', carro); // Log del carro recibido
        }),
        catchError(this.handleError) // Manejo de errores
      );
  }
  

  // Actualizar un carro por ID
  updateCar(id: number, carData: FormData): Observable<Car> {
    return this.http.put<Car>(`${this.apiUrl}/${id}`, carData, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Eliminar un carro por ID
  deleteCar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }



  // Manejo de errores
  private handleError(error: any): Observable<never> {
    console.error('Ocurrió un error', error);
    const message = error.error?.message || 'Algo salió mal; por favor intente de nuevo más tarde.';
    return throwError(() => new Error(message));
  }
}
