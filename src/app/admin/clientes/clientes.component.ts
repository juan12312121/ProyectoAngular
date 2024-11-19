import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';

interface Cliente {
  id: number;
  nombre: string;
  correo: string;
  telefono: string;
  fechaRegistro: string;
}

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [SidebarComponent,CommonModule],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export default class ClientesComponent {

  // Datos de los clientes (en un escenario real, estos vendrían de un API)
  clientes: Cliente[] = [
    { id: 1, nombre: 'Juan Pérez', correo: 'juanperez@email.com', telefono: '123456789', fechaRegistro: '2024-01-01' },
    { id: 2, nombre: 'María López', correo: 'marialopez@email.com', telefono: '987654321', fechaRegistro: '2023-03-15' },
    { id: 3, nombre: 'Carlos Gómez', correo: 'carlosgomez@email.com', telefono: '555666777', fechaRegistro: '2024-02-20' },
    { id: 4, nombre: 'Ana Sánchez', correo: 'anasanchez@email.com', telefono: '888999000', fechaRegistro: '2023-11-10' },
    // Agrega más clientes si es necesario...
  ];

  // Paginación
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = this.clientes.length;
  totalPages: number = Math.ceil(this.totalItems / this.itemsPerPage);
  paginatedClientes: Cliente[] = this.clientes.slice(0, this.itemsPerPage);

  // Cambiar de página
  onPageChange(page: number) {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedClientes = this.clientes.slice(startIndex, endIndex);
  }
}
