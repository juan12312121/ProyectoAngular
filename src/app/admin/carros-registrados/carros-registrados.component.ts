import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Car, CarrosService } from '../../core/services/carros.service';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-carros-registrados',
  standalone: true,
  imports: [SidebarComponent, CommonModule],
  templateUrl: './carros-registrados.component.html',
  styleUrls: ['./carros-registrados.component.css']
})
export default class CarrosRegistradosComponent implements OnInit {
  carros: Car[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 15; 
  totalItems: number = 0; 
  totalPages: number = 0; 
  paginatedCarros: Car[] = []; 

  constructor(private carrosService: CarrosService, private router: Router) {}

  ngOnInit(): void {
    this.obtenerCarros();
  }

  obtenerCarros(): void {
    this.carrosService.getAllCarsAdmin().subscribe(
      (data: Car[]) => {
        this.carros = data;
        this.totalItems = this.carros.length; 
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage); 
        this.updatePaginatedCarros();
        this.logCarros();
      },
      (error: any) => {
        console.error('Error al obtener los carros:', error);
      }
    );
  }

  updatePaginatedCarros(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedCarros = this.carros.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return; 
    this.currentPage = page; 
    this.updatePaginatedCarros(); 
  }

  eliminarCarro(carroId: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡Esta acción no se puede deshacer!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d69e2e',
      cancelButtonColor: '#e53e3e',
      confirmButtonText: 'Sí, eliminarlo',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.carrosService.deleteCar(carroId).subscribe(
          () => {
            this.carros = this.carros.filter(carro => carro.id !== carroId); 
            this.totalItems--; 
            this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage); 
            this.updatePaginatedCarros(); 
            Swal.fire('Eliminado!', 'El carro ha sido eliminado correctamente.', 'success');
          },
          (error) => {
            Swal.fire('Error!', 'No se pudo eliminar el carro. Intenta nuevamente.', 'error');
            console.error('Error al eliminar el carro:', error);
          }
        );
      }
    });
  }

  confirmDelete(carroId: number): void {
    this.eliminarCarro(carroId);
  }

  agregarCarro(): void {
    this.router.navigate(['/admin/agregar-carro']);
  }

  editarCarro(carroId: number): void {
    this.router.navigate(['/admin/editar-carro', carroId]); 
  }

  logCarros(): void {
    console.log('Lista de Carros Registrados:', this.carros);
  }  
}
