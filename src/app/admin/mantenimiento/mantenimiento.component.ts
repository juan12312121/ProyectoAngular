import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

import { CarrosService } from '../../core/services/carros.service';
import { Maintenance, MaintenanceService, TipoMantenimiento } from '../../core/services/manteni.service';

@Component({
  selector: 'app-mantenimiento',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mantenimiento.component.html',
  styleUrls: ['./mantenimiento.component.css']
})
export class MantenimientoComponent {
  tipoMantenimiento: TipoMantenimiento | null = null;
  costo: number | null = null;
  idCarro: number | null = null; // id_carro directamente

  tipoMantenimientoOptions = [
    { value: 'Preventivo', costo: 100 },
    { value: 'De emergencia', costo: 200 },
    { value: 'Revisión general', costo: 150 },
    { value: 'Cambio de aceite', costo: 50 },
    { value: 'Reemplazo de frenos', costo: 120 },
    { value: 'Alineación y balanceo', costo: 80 }
  ];

  carros: any[] = []; // Listado de carros, que puedes obtener de un servicio

  constructor(private maintenanceService: MaintenanceService, private carrosService: CarrosService) {
    // Cargar los carros al inicio
    this.carrosService.getAllCarsAdmin().subscribe(
      (response) => {
        this.carros = response;
      },
      (error) => {
        console.error('Error al obtener los carros', error);
      }
    );
  }

  // Función para crear un nuevo mantenimiento
  crearMantenimiento() {
    if (!this.tipoMantenimiento || !this.idCarro) {
      Swal.fire({
        icon: 'warning',
        title: '¡Advertencia!',
        text: 'Por favor, complete todos los campos (tipo de mantenimiento y carro)',
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    const mantenimiento = this.tipoMantenimientoOptions.find(option => option.value === this.tipoMantenimiento);

    if (!mantenimiento) {
      Swal.fire({
        icon: 'warning',
        title: '¡Advertencia!',
        text: 'El costo no está definido para este tipo de mantenimiento',
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    const mantenimientoData: Maintenance = {
      id_carro: this.idCarro,  // Usamos id_carro directamente
      tipo_mantenimiento: this.tipoMantenimiento,
      costo: mantenimiento.costo,
      fecha_mantenimiento: new Date().toISOString(),
      descripcion: '',  // Aquí puedes agregar la descripción si lo necesitas
      mecanico: ''  // Aquí puedes agregar el mecánico si lo necesitas
    };

    this.maintenanceService.createMaintenance(mantenimientoData).subscribe(
      (response) => {
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Mantenimiento creado exitosamente',
          confirmButtonText: 'Aceptar'
        });
        // Limpiar campos después de la respuesta exitosa
        this.tipoMantenimiento = null;
        this.idCarro = null; // Limpiar id_carro
      },
      (error) => {
        console.error('Error en la solicitud de mantenimiento:', error);
        Swal.fire({
          icon: 'error',
          title: '¡Error!',
          text: `Hubo un error al crear el mantenimiento. Detalles: ${error.message}`,
          confirmButtonText: 'Aceptar'
        });
      }
    );
  }

  // Función para establecer el ID del carro seleccionado
  setIdCarro(id: number) {
    this.idCarro = id;
  }
}
