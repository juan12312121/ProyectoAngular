import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Importar Router
import Swal from 'sweetalert2'; // Importar SweetAlert2
import { AuthService } from '../../core/services/auth.service';
import { SidebarComponent } from '../sidebar/sidebar.component';

interface Cliente {
  id: number;
  nombre_completo: string;
  nombre_usuario: string;
  correo: string;
  fecha_creacion: string;
}

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [SidebarComponent, CommonModule],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css'],
})
export default class ClientesComponent implements OnInit {

  clientes: Cliente[] = []; // Full list of clients
  currentPage: number = 1; // Current page for pagination
  itemsPerPage: number = 7; // Number of clients per page
  totalItems: number = 0; // Total number of clients
  totalPages: number = 0; // Total number of pages for pagination
  paginatedClientes: Cliente[] = []; // Clients for the current page

  constructor(
    private authService: AuthService,
    private router: Router  // Inyectar Router
  ) {}

  ngOnInit(): void {
    // Fetching users with role 1 (Admin, for example)
    this.authService.getUsersByRole(1).subscribe((data) => {
      this.clientes = data; // Assuming the response is an array of clients
      this.totalItems = this.clientes.length;
      this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage); // Calculate total pages
      this.paginatedClientes = this.clientes.slice(0, this.itemsPerPage); // Slice the first page
    });
  }

  // Change the page and fetch paginated data
  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedClientes = this.clientes.slice(startIndex, endIndex);
  }

  // Eliminar usuario con confirmación de SweetAlert2
  deleteUser(clienteId: number): void {
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
        // Lógica para eliminar al cliente
        this.authService.deleteUser(clienteId).subscribe(
          () => {
            Swal.fire(
              'Eliminado!',
              'El cliente ha sido eliminado.',
              'success'
            );
            // Actualiza la lista de clientes después de la eliminación
            this.clientes = this.clientes.filter(cliente => cliente.id !== clienteId);
            this.totalItems = this.clientes.length;
            this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage); // Recalculamos las páginas
            this.paginatedClientes = this.clientes.slice(0, this.itemsPerPage); // Re-renderizar los clientes de la primera página
          },
          () => {
            Swal.fire(
              'Error',
              'Hubo un problema al eliminar al cliente.',
              'error'
            );
          }
        );
      }
    });
  }

  // Método para redirigir al historial de usuarios con el ID
  verHistorial(id: number) {
    this.router.navigate([`/historial-usuarios-admin/${id}`]);
  }
}
