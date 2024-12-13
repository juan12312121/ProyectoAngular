import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import Swal from 'sweetalert2';
import {
  Maintenance,
  MaintenanceService,
} from '../../core/services/manteni.service';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  standalone: true,
  imports: [CommonModule, SidebarComponent, FormsModule, NgxPaginationModule],
  templateUrl: './carros-matenimiento.component.html',
  styleUrls: ['./carros-matenimiento.component.css'],
})
export default class CarrosEnMantenimientoComponent implements OnInit {
  mantenimientos: Maintenance[] = [];
  mantenimientosTerminados: Maintenance[] = [];
  mantenimientosEnCurso: Maintenance[] = [];
  totalCostosEnCurso: number = 0;
  totalCostosTerminados: number = 0;

  currentTab: 'enCurso' | 'terminados' = 'enCurso';

  setTab(tab: 'enCurso' | 'terminados') {
    this.currentTab = tab;
    this.currentPage = 1; // Resetear a la primera página al cambiar de tab
    this.updateTotalPages(); // Actualizar el número total de páginas
    this.updatePageData(); // Actualizar los datos según la página actual
  }
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  constructor(private maintenanceService: MaintenanceService) {}

  ngOnInit(): void {
    this.obtenerMantenimientos();
    const totalGuardado = localStorage.getItem('totalCostos');
    if (totalGuardado) {
      this.totalCostosEnCurso = parseFloat(totalGuardado);
    }
  }

  obtenerMantenimientos(): void {
    this.maintenanceService.getAllMaintenances().subscribe(
      (mantenimientos: Maintenance[]) => {
        this.mantenimientos = mantenimientos;

        // Clasificar los mantenimientos
        this.mantenimientosEnCurso = mantenimientos.filter(
          (mantenimiento) =>
            mantenimiento.estado_mantenimiento === 'En mantenimiento'
        );
        this.mantenimientosTerminados = mantenimientos.filter(
          (mantenimiento) =>
            mantenimiento.estado_mantenimiento === 'Mantenimiento terminado'
        );

        // Calcular los costos de cada tipo
        this.calcularTotalEnCurso();
        this.calcularTotalTerminados();

        // Actualizar el total de páginas y la paginación
        this.updateTotalPages();
        this.updatePageData(); // Filtrar los datos según la página actual
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: '¡Error!',
          text:
            'Hubo un error al obtener los mantenimientos. Detalles: ' +
            error.message,
        });
      }
    );
  }

  updateTotalPages(): void {
    const currentList =
      this.currentTab === 'enCurso' ? this.mantenimientosEnCurso : this.mantenimientosTerminados;
  
    // Calcular el número total de páginas
    this.totalPages = Math.ceil(currentList.length / this.itemsPerPage);
  
    // Asegurarse de que haya al menos una página
    if (this.totalPages < 1) {
      this.totalPages = 1; // Evitar que se muestre 0 páginas
    }
  }

  // Filtra los mantenimientos a mostrar según la página actual
  updatePageData(): void {
    // Filtrar los mantenimientos según el estado actual (enCurso o terminados)
    const currentList =
      this.currentTab === 'enCurso' ? this.mantenimientosEnCurso : this.mantenimientosTerminados;
  
    // Calcular el índice de inicio y fin según la página actual y los elementos por página
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
  
    // Limitar los elementos a los de la página actual
    this.mantenimientos = currentList.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
  
    // Actualizar la página actual
    this.currentPage = page;
    this.updatePageData(); // Actualizar los datos visibles
  }

  cambiarEstadoMantenimiento(index: number, nuevoEstado: string): void {
    const mantenimiento = this.mantenimientos[index];

    if (!mantenimiento.id_carro) {
      Swal.fire({
        icon: 'error',
        title: '¡Error!',
        text: 'ID de carro no válido.',
      });
      return;
    }

    if (
      nuevoEstado !== 'En mantenimiento' &&
      nuevoEstado !== 'Mantenimiento terminado'
    ) {
      Swal.fire({
        icon: 'error',
        title: '¡Error!',
        text: 'Estado de mantenimiento no válido.',
      });
      return;
    }

    Swal.fire({
      title: '¿Estás seguro?',
      text: `Este mantenimiento será marcado como "${nuevoEstado}".`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Sí, cambiar a ${nuevoEstado}`,
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        // Update maintenance state logic
        this.maintenanceService
          .updateMaintenanceState(mantenimiento.id_carro, nuevoEstado)
          .subscribe(
            (response) => {
              // Successfully updated state
              mantenimiento.estado_mantenimiento = nuevoEstado;
              // Update the arrays to reflect the changes
              if (nuevoEstado === 'Mantenimiento terminado') {
                this.mantenimientosEnCurso.splice(index, 1);
                this.mantenimientosTerminados.push(mantenimiento);
              } else {
                this.mantenimientosTerminados.splice(index, 1);
                this.mantenimientosEnCurso.push(mantenimiento);
              }
              Swal.fire(
                'Estado actualizado',
                'El mantenimiento ha sido actualizado correctamente.',
                'success'
              );
              this.calcularTotalEnCurso();
              this.calcularTotalTerminados();
              this.updateTotalPages(); // Actualiza el total de páginas al cambiar el estado
              this.updatePageData(); // Actualiza la página visible al cambiar el estado
            },
            (error) => {
              Swal.fire({
                icon: 'error',
                title: '¡Error!',
                text:
                  'Hubo un error al actualizar el estado del mantenimiento. Detalles: ' +
                  error.message,
              });
            }
          );
      }
    });
  }

  calcularTotalEnCurso(): void {
    // Calcular el total de los mantenimientos en curso
    this.totalCostosEnCurso = this.mantenimientosEnCurso.reduce((total, mantenimiento) => {
      const valor = parseFloat(mantenimiento.costo as any); // Convertir el costo a número
      return total + (isNaN(valor) ? 0 : valor); // Verificar si es un número válido
    }, 0);

    // Guardar el total en localStorage
    localStorage.setItem('totalCostosEnCurso', this.totalCostosEnCurso.toString());
  }

  calcularTotalTerminados(): void {
    // Calcular el total de los mantenimientos terminados
    this.totalCostosTerminados = this.mantenimientosTerminados.reduce((total, mantenimiento) => {
      const valor = parseFloat(mantenimiento.costo as any); // Convertir el costo a número
      return total + (isNaN(valor) ? 0 : valor); // Verificar si es un número válido
    }, 0);

    // Guardar el total en localStorage
    localStorage.setItem('totalCostosTerminados', this.totalCostosTerminados.toString());
  }
}
