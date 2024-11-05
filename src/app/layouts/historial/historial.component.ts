import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historial.component.html',
})
export default class HistorialComponent {
  // Datos simulados de la renta del usuario
  rentals = [
    {
      imgSrc: 'img/fordmustang.jpg',
      brand: 'Ford Mustang',
      year: 2023,
      doors: 2,
      transmission: 'Automática',
      capacity: '4 pasajeros',
      pricePerDay: '$100',
      status: 'Pendiente',
      description: 'El Ford Mustang 2023 es un coche deportivo icónico que ofrece un rendimiento excepcional, un diseño llamativo y tecnología avanzada. Perfecto para los amantes de la velocidad.',
      rentalDate: '2024-10-12',
      rentalDuration: '3 días',
      returnDate: '2024-10-15',
    },
    // Puedes agregar más datos de alquiler si es necesario
  ];
}
