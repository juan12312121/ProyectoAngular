import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Car, CarrosService } from '../../core/services/carros.service';
import { Maintenance, MaintenanceService } from '../../core/services/manteni.service';
import { SidebarComponent } from '../sidebar/sidebar.component';


// Enum of maintenance types with associated costs
export enum TipoMantenimiento {
  Preventivo = 'Preventivo',
  Emergencia = 'De emergencia',
  RevisionGeneral = 'Revisión general',
  CambioAceite = 'Cambio de aceite',
  ReemplazoFrenos = 'Reemplazo de frenos',
  AlineacionBalanceo = 'Alineación y balanceo',
}

// Map of maintenance types to their costs
const MantenimientoCosts: { [key in TipoMantenimiento]: number } = {
  [TipoMantenimiento.Preventivo]: 500,
  [TipoMantenimiento.Emergencia]: 1000,
  [TipoMantenimiento.RevisionGeneral]: 1500,
  [TipoMantenimiento.CambioAceite]: 500,
  [TipoMantenimiento.ReemplazoFrenos]: 1500,
  [TipoMantenimiento.AlineacionBalanceo]: 800,
};

@Component({
  selector: 'app-carros-registrados',
  standalone: true,
  imports: [SidebarComponent, CommonModule,FormsModule],
  templateUrl: './carros-registrados.component.html',
  styleUrls: ['./carros-registrados.component.css']
})
export default class CarrosRegistradosComponent implements OnInit {

  carros: Car[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;
  paginatedCarros: Car[] = [];
  isLoading: boolean = false; // Flag for loading state
  mantenimientoData: { [key: number]: TipoMantenimiento } = {}; 
  tipoMantenimiento: TipoMantenimiento | null = null;
  idCarro: number | null = null;
  tipoMantenimientoOptions = Object.values(TipoMantenimiento); // Get all enum values

  constructor(
    private carrosService: CarrosService,
    private router: Router,
    private maintenanceService: MaintenanceService
  ) {}

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

  agregarCarro(): void {
    this.router.navigate(['/admin/agregar-carro']);
  }

  CarrosMantenimiento(): void {
    this.router.navigate(['carro-mantenimiento']);
  }

  editarCarro(carroId: number): void {
    this.router.navigate(['/admin/editar-carro', carroId]);
  }

  logCarros(): void {
    console.log('Lista de Carros Registrados:', this.carros);
  }

  // Function to create maintenance
  crearMantenimiento(carroId: number): void {
    const tipoMantenimiento = this.mantenimientoData[carroId];  
    if (!tipoMantenimiento) {
      Swal.fire({
        icon: 'warning',
        title: '¡Advertencia!',
        text: 'Por favor, seleccione un tipo de mantenimiento',
        confirmButtonText: 'Aceptar'
      });
      return;
    }
  
    this.isLoading = true; // Inicia el loading
    const costo = MantenimientoCosts[tipoMantenimiento];
    if (!costo) {
      Swal.fire({
        icon: 'warning',
        title: '¡Advertencia!',
        text: 'El costo no está definido para este tipo de mantenimiento',
        confirmButtonText: 'Aceptar'
      });
      this.isLoading = false;
      return;
    }
  
    // Formatear la fecha correctamente para MySQL (YYYY-MM-DD HH:MM:SS)
    const fechaMantenimiento = new Date().toISOString().slice(0, 19).replace('T', ' ');
  
    const mantenimientoData: Maintenance = {
      id_carro: carroId,
      tipo_mantenimiento: tipoMantenimiento,
      costo: costo,
      fecha_mantenimiento: fechaMantenimiento,
      id_mantenimiento: 0,
      fecha_creacion: '',
      marca: '',
      modelo: ''
    };
  
    this.maintenanceService.createMaintenance(mantenimientoData).subscribe(
      () => {
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Mantenimiento creado exitosamente',
          confirmButtonText: 'Aceptar'
        });
        this.isLoading = false;
      },
      (error) => {
        console.error('Error en la solicitud de mantenimiento:', error);
        Swal.fire({
          icon: 'error',
          title: '¡Error!',
          text: `Hubo un error al crear el mantenimiento. Detalles: ${error.message}`,
          confirmButtonText: 'Aceptar'
        });
        this.isLoading = false;
      }
    );
  }

  setTipoMantenimiento(carroId: number, tipo: TipoMantenimiento): void {
    this.mantenimientoData[carroId] = tipo; // Almacena el tipo de mantenimiento seleccionado para cada carro
  }
  

  setIdCarro(carroId: number) {
    // Acción a realizar con el ID del carro
    console.log(carroId);
  }
}
