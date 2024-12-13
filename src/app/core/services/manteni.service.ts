import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { AuthService } from './auth.service';

// Interfaz para estructurar los datos de mantenimiento
export interface Maintenance {
  id_mantenimiento: number;
  tipo_mantenimiento: 'Preventivo' | 'De emergencia' | 'Revisión general' | 'Cambio de aceite' | 'Reemplazo de frenos' | 'Alineación y balanceo';
  costo: number;
  estado_pago: 'Pagada' | 'Pendiente';  // Aquí defines el estado de pago
  fecha_mantenimiento: string;
  fecha_creacion: string;  // O usa 'timestamp' si lo prefieres
  marca: string;
  estado_mantenimiento: string; // O usa 'timestamp' si
  gastos: number;
  modelo: string;
  id_carro: number;
}


// Enum de tipos de mantenimiento fuera del servicio
export enum TipoMantenimiento {
  Preventivo = 'Preventivo',
  Emergencia = 'De emergencia',
  RevisionGeneral = 'Revisión general',
  CambioAceite = 'Cambio de aceite',
  ReemplazoFrenos = 'Reemplazo de frenos',
  AlineacionBalanceo = 'Alineación y balanceo',
}

@Injectable({
  providedIn: 'root',
})
export class MaintenanceService {
  private apiUrl = 'http://localhost:3500/mantenimiento';

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Obtener Headers con el token de autenticación
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken(); // Obtener el token desde AuthService
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // Agregar token al header
    });
  }

  // Crear un nuevo mantenimiento
  createMaintenance(data: Maintenance): Observable<Maintenance> {
    // Validamos el tipo de mantenimiento utilizando el enum fuera del servicio
    if (
      data.tipo_mantenimiento &&
      !Object.values(TipoMantenimiento).includes(data.tipo_mantenimiento as TipoMantenimiento)
    ) {
      throw new Error('Tipo de mantenimiento inválido');
    }

    // Log de los datos que se enviarán
    console.log('Enviando datos de mantenimiento:', data);

    return this.http.post<Maintenance>(this.apiUrl, data, {
      headers: this.getHeaders(), 
    }).pipe(
      // Log de la respuesta
      tap(response => console.log('Respuesta de la creación de mantenimiento:', response)),
    );
  }

  // Obtener todos los mantenimientos
  getAllMaintenances(): Observable<Maintenance[]> {
    console.log('Obteniendo todos los mantenimientos...');
    return this.http.get<Maintenance[]>(this.apiUrl, { headers: this.getHeaders() }).pipe(
      tap(response => console.log('Datos de todos los mantenimientos:', response))
    );
  }

  // Obtener mantenimiento por ID
  getMaintenanceById(id: number): Observable<Maintenance> {
    console.log(`Obteniendo mantenimiento con ID: ${id}`);
    return this.http.get<Maintenance>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    }).pipe(
      tap(response => console.log(`Datos del mantenimiento con ID ${id}:`, response))
    );
  }

  // Actualizar un mantenimiento
  updateMaintenance(id: number, data: Maintenance): Observable<Maintenance> {
    // Validamos el tipo de mantenimiento utilizando el enum fuera del servicio
    if (
      data.tipo_mantenimiento &&
      !Object.values(TipoMantenimiento).includes(data.tipo_mantenimiento as TipoMantenimiento)
    ) {
      throw new Error('Tipo de mantenimiento inválido');
    }

    console.log(`Actualizando mantenimiento con ID: ${id}`, data);

    return this.http.put<Maintenance>(`${this.apiUrl}/${id}`, data, {
      headers: this.getHeaders(),
    }).pipe(
      tap(response => console.log(`Respuesta de la actualización del mantenimiento con ID ${id}:`, response))
    );
  }

  // Eliminar un mantenimiento
  deleteMaintenance(id: number): Observable<void> {
    console.log(`Eliminando mantenimiento con ID: ${id}`);
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    }).pipe(
      tap(response => console.log(`Respuesta de la eliminación del mantenimiento con ID ${id}:`, response))
    );
  }

  getTotalGastos(id: number): Observable<any> {
    console.log(`Obteniendo gasto total para el mantenimiento con ID: ${id}`);

    return this.http.get<any>(`${this.apiUrl}/gastos/${id}`, {
      headers: this.getHeaders(),
    }).pipe(
      tap(response => {
        console.log('Respuesta del gasto total:', response);
      })
    );
  }

  
  updateMaintenanceState(id_carro: number, estado_mantenimiento: string): Observable<any> {
    // Verificar que el estado de mantenimiento sea válido
    const validStates = ['Mantenimiento terminado'];
    if (!validStates.includes(estado_mantenimiento)) {
      throw new Error('Estado de mantenimiento inválido');
    }
  
    // Crear el objeto de datos a enviar
    const data = { estado_mantenimiento };
  
    console.log(`Actualizando estado de mantenimiento del carro con ID: ${id_carro}`);
    console.log('Datos enviados al backend:', data);
    console.log('URL completa de la solicitud:', `${this.apiUrl}/estado/${id_carro}`);
  
    // Realizar la solicitud PUT para actualizar el estado
    return this.http.put<any>(`${this.apiUrl}/estado/${id_carro}`, data, {
      headers: this.getHeaders(),
    }).pipe(
      tap(response => {
        // Log de la respuesta de la actualización
        console.log('Respuesta recibida del backend:', response);
      }),
      catchError(error => {
        // Log de cualquier error en la solicitud
        console.error('Error al realizar la solicitud PUT:', error);
        return throwError(error);
      })
    );
  }

}
