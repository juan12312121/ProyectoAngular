import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthService } from './auth.service';

// Interfaz para estructurar los datos de mantenimiento
export interface Maintenance {
  id_carro: number;

  id_mantenimiento: number;
  tipo_mantenimiento: string;
  costo: number;
  fecha_mantenimiento: string;
  fecha_creacion: string;
  // Asegúrate de agregar estas propiedades que vienen del JOIN en tu SQL
  marca: string;  // Nueva propiedad
  modelo: string;  // Nueva propiedad
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
}