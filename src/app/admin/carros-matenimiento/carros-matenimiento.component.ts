import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Maintenance, MaintenanceService } from '../../core/services/manteni.service';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  standalone: true,
  imports: [CommonModule, SidebarComponent, FormsModule],
  templateUrl: './carros-matenimiento.component.html',
  styleUrls: ['./carros-matenimiento.component.css'],
})
export default class CarrosEnMantenimientoComponent implements OnInit {
  mantenimientos: Maintenance[] = [];
  mantenimientosTerminados: Maintenance[] = []; // Nueva lista para los mantenimientos terminados
  totalGastos: number = 0;

  constructor(private maintenanceService: MaintenanceService) {}

  ngOnInit(): void {
    this.obtenerMantenimientos();
  }

  obtenerMantenimientos(): void {
    this.maintenanceService.getAllMaintenances().subscribe(
      (mantenimientos: Maintenance[]) => {
        this.mantenimientos = mantenimientos;
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: '¡Error!',
          text: 'Hubo un error al obtener los mantenimientos. Detalles: ' + error.message,
        });
        console.error('Error al obtener los mantenimientos:', error);
      }
    );
  }

  terminarMantenimiento(index: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Este mantenimiento será marcado como completado.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, Terminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        const mantenimientoId = this.mantenimientos[index].id_mantenimiento;

        // Mover el mantenimiento a la lista de mantenimientos terminados
        const mantenimientoTerminado = this.mantenimientos[index];
        this.mantenimientos.splice(index, 1); // Eliminar el mantenimiento de la lista original
        this.mantenimientosTerminados.push(mantenimientoTerminado); // Agregarlo a la lista de mantenimientos terminados

        Swal.fire(
          'Mantenimiento Completado!',
          'El mantenimiento se ha completado exitosamente.',
          'success'
        );
      }
    });
  }
}
