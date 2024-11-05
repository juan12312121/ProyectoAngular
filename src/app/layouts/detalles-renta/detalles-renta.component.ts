import { Component } from '@angular/core';

@Component({
  selector: 'app-detalles-renta',
  standalone: true,
  imports: [], // Aquí puedes agregar módulos que necesites, si es necesario.
  templateUrl: './detalles-renta.component.html',
})
export default class DetallesRentaComponent {
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
    },
    {
      imgSrc: 'img/nissan370z.jpg',
      brand: 'Nissan 370Z',
      year: 2021,
      doors: 2,
      transmission: 'Manual',
      capacity: '2 pasajeros',
      pricePerDay: '$90',
      status: 'Pagado',
    },
    {
      imgSrc: 'img/chevytahoe.jpg',
      brand: 'Chevy Tahoe',
      year: 2019,
      doors: 4,
      transmission: 'Automática',
      capacity: '7 pasajeros',
      pricePerDay: '$110',
      status: 'Devuelto',
    },
  ];
}
