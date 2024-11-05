import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, effect, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../core/services/auth.service';
import { Car, CarrosService } from '../../core/services/carros.service';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-carros',
  standalone: true,
  imports: [CommonModule,NavbarComponent, FormsModule],
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
  selectedPrice: number = 1000; // Default max price
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
    this.checkLoginStatus();
    this.loadNotifications();
    this.loadUserCars();

    // Effect to reload cars when a new one is added
    effect(() => {
      if (this.carrosService.carAddedSignal()) { // Invocando la señal
        this.loadUserCars(); // Reload cars when a new one is added
      }
    });
  }

  loadUserCars() {
    this.loadingImage = true;
    this.carrosService.getUserCars().subscribe(
      (data: Car[]) => {
        this.carros = data.map((car) => ({
          ...car,
          imagen: car.imagen
            ? `http://localhost:3500/${car.imagen}`
            : 'http://localhost:3500/uploads/ruta/a/imagen/predeterminada.jpg',
        }));
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
      const matchesMarca =
        this.filters.marcas.size === 0 || this.filters.marcas.has(car.marca);
      const matchesModelo =
        this.filters.modelos.size === 0 || this.filters.modelos.has(car.modelo);
      const matchesCategoria =
        this.filters.categorias.size === 0 || this.filters.categorias.has(car.categoria);
      const matchesPrice = car.precio_diaro <= this.selectedPrice;

      return matchesMarca && matchesModelo && matchesCategoria && matchesPrice;
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

  filterByPrice() {
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

  toggleProfileDropdown() {
    this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
    this.isNotificationDropdownOpen = false;
  }

  toggleNotificationDropdown() {
    this.isNotificationDropdownOpen = !this.isNotificationDropdownOpen;
    this.isProfileDropdownOpen = false;
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;

    Swal.fire({
      icon: 'success',
      title: 'Cierre de sesión exitoso',
      text: 'Has cerrado sesión correctamente.',
      confirmButtonText: 'Aceptar',
    });
  }

  checkLoginStatus() {
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  loadNotifications() {
    this.notifications = ['Notificación 1', 'Notificación 2', 'Notificación 3'];
  }

  verDetalles(carro: Car) {
    console.log('Carro pasado a verDetalles:', carro); // Registra el objeto carro
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
    // No need for manual cleanup since we're using effects
  }
}
