import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../core/services/auth.service'; 
import { Car, CarrosService } from '../../core/services/carros.service'; 
import { Promotion, PromotionsService } from '../../core/services/promotions.service'; 
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-aplicar-promocion',
  standalone: true,
  imports: [SidebarComponent, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './aplicar-promocion.component.html',
  styleUrls: ['./aplicar-promocion.component.css'],
})
export default class AplicarPromocionComponent implements OnInit {
  selectedCars: Car[] = [];
  cars: Car[] = []; // Lista completa de autos
  paginatedCarros: Car[] = []; // Autos para la página actual
  promotions: Promotion[] = []; // Lista de promociones disponibles
  selectedPromotionId: number | null = null; // ID de la promoción seleccionada
  isLoading: boolean = true; // Estado de carga
  currentPage: number = 1; // Página actual
  itemsPerPage: number = 6; // Autos por página
  totalItems: number = 0; // Total de autos
  totalPages: number = 0; // Total de páginas
  isPromotionInactive: boolean = false;

  isAllSelected(): boolean {
    return this.paginatedCarros.length === this.selectedCars.length;
  }

  toggleSelectAll($event: Event): void {
    const isChecked = ($event.target as HTMLInputElement).checked;
    this.paginatedCarros.forEach(car => {
      car.selected = isChecked;
    });

    this.onCarSelectionChange(); // Actualizar la lista de vehículos seleccionados
  }

  onCarSelectionChange(): void {
    // Filtramos los carros seleccionados
    this.selectedCars = this.cars.filter(car => car.selected);
    console.log('Vehículos seleccionados:', this.selectedCars); // Verificar los carros seleccionados
  }

  constructor(
    private carrosService: CarrosService,
    private authService: AuthService,
    private promotionsService: PromotionsService,
    private route: ActivatedRoute // Inyectar ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Capturar el parámetro "id_promocion" desde la URL
    this.route.paramMap.subscribe(params => {
      const promoId = params.get('id_promocion');
      if (promoId) {
        this.selectedPromotionId = +promoId;  // Convertir a número
        console.log('Promoción seleccionada desde URL:', this.selectedPromotionId);
      } else {
        console.error('No se encontró el parámetro id_promocion en la URL');
      }
    });

    // Cargar autos y promociones
    this.getAllCars();
    this.getPromotions();
  }

  // Obtener todos los autos del servicio
  getAllCars(): void {
    this.carrosService.getAllCarsAdmin().subscribe({
      next: (response) => {
        this.cars = response;
  
        // Log de los carros obtenidos
        console.log('Carros obtenidos:', this.cars);
  
        this.totalItems = this.cars.length;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        this.updatePaginatedCars();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al obtener autos:', err);
        this.isLoading = false;
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al cargar los vehículos.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      },
    });
  }
  

  // Obtener todas las promociones disponibles
  getPromotions(): void {
    this.promotionsService.getAllPromotions(this.currentPage, this.itemsPerPage).subscribe({
      next: (response) => {
        this.promotions = response; // Asignar las promociones
      },
      error: (err) => {
        console.error('Error al obtener promociones:', err);
      },
    });
  }

  // Actualizar la lista de autos para la página actual
  updatePaginatedCars(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedCarros = this.cars.slice(start, end);
    console.log('Autos paginados:', this.paginatedCarros); // Verificar autos para la página
  }

  // Cambiar de página
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedCars();
    }
  }

  // Implementar lógica para aplicar promoción
  aplicarPromocion(idCarro: number, promoId: number): void {
    if (!promoId) {
      console.error('Debe seleccionar una promoción');
      return;
    }

    console.log(`Aplicando promoción ${promoId} al auto con ID: ${idCarro}`);

    // Llamar al servicio para aplicar la promoción
    this.promotionsService.applyPromotionToCar(idCarro, promoId).subscribe({
      next: (response) => {
        console.log('Promoción aplicada exitosamente:', response);
        // Lógica adicional aquí
      },
      error: (err) => {
        console.error('Error al aplicar la promoción:', err);
      },
    });
  }

  // Desactivar promoción
 
  
  
  

  activarPromocion() {
    if (!this.selectedCars || this.selectedCars.length === 0) {
      Swal.fire({
        title: 'Error',
        text: 'No hay vehículos seleccionados.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return;
    }
  
    if (!this.selectedPromotionId) {
      Swal.fire({
        title: 'Error',
        text: 'Debe seleccionar una promoción.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return;
    }
  
    // Confirm action
    Swal.fire({
      title: '¿Está seguro?',
      text: `Se aplicará la promoción a ${this.selectedCars.length} vehículo(s).`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Aplicar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Apply promotion to each selected vehicle
        this.selectedCars.forEach((car) => {
          this.aplicarPromocion(car.id, this.selectedPromotionId!);
        });
  
        Swal.fire({
          title: 'Éxito',
          text: 'Promoción aplicada correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }


}
