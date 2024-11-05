import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Car, CarrosService } from '../../core/services/carros.service';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-detalle-carro',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './detalle-carro.component.html',
  styleUrls: ['./detalle-carro.component.css']
})
export default class DetalleCarroComponent implements OnInit {
  car!: Car; // Objeto para almacenar los datos del carro
  loading: boolean = true; // Estado de carga
  errorMessage: string | null = null; // Mensaje de error

  constructor(
    private route: ActivatedRoute,
    private carrosService: CarrosService,
    private location: Location
  ) {}

  ngOnInit(): void {
    const carId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('ID del carro:', carId); // Log para depuración
    if (carId) {
      this.loadCarData(carId); // Cargar datos del carro si el ID es válido
    } else {
      this.errorMessage = 'ID de carro no válido'; // Error por ID inválido
      this.loading = false;
    }
  }

  private loadCarData(id: number): void {
    console.log('Solicitando carro con ID:', id);
    this.carrosService.getCarro(id).subscribe({
      next: (data) => {
        this.car = data; // Asignar datos del carro
        console.log('Datos del carro recibidos:', this.car);
        this.loading = false; // Detener carga
      },
      error: (error) => {
        this.errorMessage = error.message || 'No se pudo cargar el carro'; // Manejar error
        console.error('Error al cargar el carro:', error);
        this.loading = false; // Detener carga
      }
    });
  }
  goBack(): void {
    this.location.back();
  }
}
