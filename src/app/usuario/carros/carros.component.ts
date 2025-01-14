import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import Swal from 'sweetalert2';
import { ChatbotComponent } from '../../components/chat-bot/chat-bot.component';
import { AuthService } from '../../core/services/auth.service';
import { Car, CarrosService } from '../../core/services/carros.service';
import { NavbarComponent } from '../navbar/navbar.component';



@Component({
  selector: 'app-carros',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FormsModule, NgxPaginationModule,ChatbotComponent],
  providers: [CurrencyPipe],
  templateUrl: './carros.component.html',
})
export default class CarrosComponent implements OnInit, OnDestroy {
  carros: Car[] = [];
  filteredCarros: Car[] = [];
  filters = {
    marcas: new Set<string>(),
    modelos: new Set<string>(),
    categorias: new Set<string>(),
    years: new Set<number>(),
  };
  selectedPrice: number = 1000;
  p: number = 1;
  isProfileDropdownOpen = false;
  isNotificationDropdownOpen = false;
  notifications: string[] = [];
  isLoggedIn = false;
  loadingImage = false;

  constructor(
    private carrosService: CarrosService,
    private authService: AuthService,
    private currencyPipe: CurrencyPipe,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Obtener el estado de autenticación
    this.isLoggedIn = this.authService.isAuthenticated();
    // Cargar carros independientemente del estado de autenticación
    this.loadUserCars();
    
  }

  

  loadUserCars() {
  this.loadingImage = true;
  this.carrosService.getUserCars().subscribe(
    (data: Car[]) => {
      console.log('Datos recibidos de la API:', data);
      this.carros = data.map((car) => ({
        ...car,
        imagen: car.imagen
          ? `https://backend-2-f5qo.onrender.com/${car.imagen}`
          : 'https://backend-2-f5qo.onrender.com/uploads/ruta/a/imagen/predeterminada.jpg',
        promocion: car.promocion,
      }));
      console.log('Carros después de mapear imágenes y promocion:', this.carros);
      this.filteredCarros = this.carros;
      this.loadingImage = false;
    },
    (error) => {
      console.error('Error al obtener los coches', error);
      this.loadingImage = false;
    }
  );
}


  

  applyFilters() {
    this.filteredCarros = this.carros.filter((car) => {
      const matchesMarca = this.filters.marcas.size === 0 || this.filters.marcas.has(car.marca);
      const matchesModelo = this.filters.modelos.size === 0 || this.filters.modelos.has(car.modelo);
      const matchesCategoria = this.filters.categorias.size === 0 || this.filters.categorias.has(car.categoria);
      const matchesYear = this.filters.years.size === 0 || this.filters.years.has(car.anio);
      const matchesPrice = car.precio_diaro <= this.selectedPrice;

      return matchesMarca && matchesModelo && matchesCategoria && matchesYear && matchesPrice;
    });
  }

  toggleMarca(marca: string) {
    if (this.filters.marcas.has(marca)) {
      this.filters.marcas.delete(marca);
    } else {
      this.filters.marcas.add(marca);
    }
    this.applyFilters();
  }

  toggleModelo(modelo: string) {
    if (this.filters.modelos.has(modelo)) {
      this.filters.modelos.delete(modelo);
    } else {
      this.filters.modelos.add(modelo);
    }
    this.applyFilters();
  }

  toggleCategoria(categoria: string) {
    if (this.filters.categorias.has(categoria)) {
      this.filters.categorias.delete(categoria);
    } else {
      this.filters.categorias.add(categoria);
    }
    this.applyFilters();
  }

  toggleYear(year: number) {
    if (this.filters.years.has(year)) {
      this.filters.years.delete(year);
    } else {
      this.filters.years.add(year);
    }
    this.applyFilters();
  }

  filterByPrice() {
    this.applyFilters();
  }

  verDetalles(carro: Car) {
    console.log('Carro pasado a verDetalles:', carro);
    if (carro && carro.id !== undefined) {
      this.router.navigate(['/detalle-carro', carro.id]);
    } else {
      console.error('ID del coche inválido:', carro);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo encontrar el ID del coche. Por favor, intenta de nuevo.',
        confirmButtonText: 'Aceptar',
      });
    }
  }

  ngOnDestroy(): void {
    // No es necesario hacer limpieza manual
  }

  isDescriptionExpanded: { [id: number]: boolean } = {};

  toggleDescription(id: number) {
    this.isDescriptionExpanded[id] = !this.isDescriptionExpanded[id];
  }

  truncateText(text: string, length: number) {
    if (text.length > length) {
      return text.substring(0, length) + '...';
    }
    return text;
  }
}
