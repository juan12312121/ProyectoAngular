import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-detalle-carro',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './detalle-carro.component.html',
})
export default class DetalleCarroComponent {

  clientType: string = 'normal';
  price: string = '$90/día';

  updatePrice(): void {
    switch (this.clientType) {
      case 'normal':
        this.price = '$90/día';
        break;
      case 'recurrente':
        this.price = '$80/día'; // Precio para recurrente
        break;
      case 'corporativo':
        this.price = '$70/día'; // Precio para corporativo
        break;
      default:
        this.price = '$90/día';
    }
  }

}
