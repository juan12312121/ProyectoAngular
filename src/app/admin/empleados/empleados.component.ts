import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'; // Importar SweetAlert2
import { AuthService } from '../../core/services/auth.service';
import { SidebarComponent } from '../sidebar/sidebar.component';

interface Empleado {
  id: number;
  nombre_completo: string;
  nombre_usuario: string;
  correo: string;
  fecha_creacion: string;
}

@Component({
  selector: 'app-empleados',
  standalone: true,
  imports: [SidebarComponent, CommonModule],
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.css'],
})
export default class EmpleadosComponent implements OnInit {

  empleados: Empleado[] = []; // Lista completa de empleados
  currentPage: number = 1; // Página actual para la paginación
  itemsPerPage: number = 7; // Número de empleados por página
  totalItems: number = 0; // Total de empleados
  totalPages: number = 0; // Total de páginas para paginación
  paginatedEmpleados: Empleado[] = []; // Empleados para la página actual

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Obteniendo los usuarios con rol 5 (Choferes)
    this.authService.getUsersByRole(5).subscribe((data) => {
      this.empleados = data; // Suponiendo que la respuesta es un arreglo de empleados
      this.totalItems = this.empleados.length;
      this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage); // Calcular las páginas totales
      this.paginatedEmpleados = this.empleados.slice(0, this.itemsPerPage); // Tomamos los empleados para la primera página
    });
  }

  agregarEmpleado() {
    this.router.navigate(['./agregar-empleados']);
  }

  // Cambiar la página y obtener los datos paginados
  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedEmpleados = this.empleados.slice(startIndex, endIndex);
  }

  // Eliminar empleado con confirmación de SweetAlert2
  deleteUser(empleadoId: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Este cambio no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.deleteUser(empleadoId).subscribe(
          () => {
            Swal.fire(
              'Eliminado!',
              'El empleado ha sido eliminado.',
              'success'
            );
            // Actualizamos la lista de empleados después de la eliminación
            this.empleados = this.empleados.filter(empleado => empleado.id !== empleadoId);
            this.totalItems = this.empleados.length;
            this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
            
            // Reset paginated employees based on the new list of employees
            if (this.currentPage > this.totalPages) {
              this.currentPage = this.totalPages > 0 ? this.totalPages : 1;
            }
            
            this.paginatedEmpleados = this.empleados.slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
          },
          () => {
            Swal.fire(
              'Error',
              'Hubo un problema al eliminar al empleado.',
              'error'
            );
          }
        );
      }
    });
  }
}
