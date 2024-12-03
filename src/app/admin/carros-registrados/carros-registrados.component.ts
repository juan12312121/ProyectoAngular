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
  mantenimientoData: { [key: number]: Maintenance } = {}; 


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
    // Asegúrate de que tipo_mantenimiento esté definido en this.mantenimientoData
    const mantenimiento = this.mantenimientoData[carroId];
  
    // Si no se ha seleccionado un tipo de mantenimiento, muestra una advertencia
    if (!mantenimiento) {
      Swal.fire({
        icon: 'warning',
        title: '¡Advertencia!',
        text: 'No se ha seleccionado un tipo de mantenimiento',
        confirmButtonText: 'Aceptar'
      });
      return;
    }
  
    this.isLoading = true; // Inicia el loading
  
    // Aquí ya puedes acceder al costo y tipo de mantenimiento directamente
    const { tipo_mantenimiento, costo, estado_pago, estado_mantenimiento, marca, modelo, gastos, id_carro, fecha_mantenimiento, fecha_creacion } = mantenimiento;
  
    // Si el costo no está definido, muestra una advertencia
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
  
    // Llamada al servicio para crear el mantenimiento
    this.maintenanceService.createMaintenance({
      id_carro,
      tipo_mantenimiento,
      costo,
      estado_pago,
      estado_mantenimiento,
      marca,
      modelo,
      gastos,
      fecha_mantenimiento,
      fecha_creacion,
      id_mantenimiento: 0 // El ID se maneja automáticamente en la base de datos
    }).subscribe(
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
    const costo = MantenimientoCosts[tipo]; // Suponiendo que MantenimientoCosts es un objeto que contiene los costos para cada tipo de mantenimiento.
    
    // Aquí estamos dejando que la base de datos maneje id_mantenimiento y fecha_creacion
    this.mantenimientoData[carroId] = {
      id_carro: carroId,                     // ID del carro
      tipo_mantenimiento: tipo,               // Tipo de mantenimiento (enum)
      costo: costo,                           // Costo calculado
      fecha_mantenimiento: new Date().toISOString().split('T')[0], // Fecha de mantenimiento (en formato YYYY-MM-DD)
      estado_pago: 'Pendiente',               // Estado de pago (agregado)
      marca: 'Toyota',                        // Marca del carro
      modelo: 'Corolla',                      // Modelo del carro
      gastos: 0.00,                           // Gastos adicionales (agregado)
      id_mantenimiento: 0,                    // El ID se maneja automáticamente en la base de datos
      fecha_creacion: new Date().toISOString(),  // Fecha de creación (agregada)
      estado_mantenimiento: 'Pendiente'      // Estado de mantenimiento (agregado)
    };
  }
  
  
  

  setIdCarro(carroId: number) {
    // Acción a realizar con el ID del carro
    console.log(carroId);
  }
}
