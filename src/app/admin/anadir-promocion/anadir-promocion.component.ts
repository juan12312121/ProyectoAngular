import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2'; // Importar SweetAlert2
import { PromotionsService } from '../../core/services/promotions.service'; // Asegúrate de que esta ruta sea correcta
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-anadir-promocion',
  standalone: true,
  imports: [SidebarComponent, CommonModule, FormsModule],
  templateUrl: './anadir-promocion.component.html',
  styleUrls: ['./anadir-promocion.component.css']
})
export default class AnadirPromocionComponent {
  // Variables del formulario
  codigo_promocion: string = '';
  descripcion: string = '';
  descuento: number = 0;
  fecha_inicio: string = '';
  fecha_fin: string = '';

  // Mensajes de error y éxito
  errorMessage: string = '';
  successMessage: string = '';

  // Inyección del servicio de promociones
  constructor(private promocionesService: PromotionsService) {}

  // Método para manejar el envío del formulario
  onSubmit() {
    if (this.isFormValid()) {
      // Llamada al servicio para crear una nueva promoción
      this.promocionesService.createPromotion(
        this.codigo_promocion,
        this.descripcion,
        this.descuento,
        this.fecha_inicio,
        this.fecha_fin
      ).subscribe(
        (response) => {
          // Si la creación es exitosa
          this.successMessage = 'Promoción agregada exitosamente';
          Swal.fire({
            title: '¡Éxito!',
            text: 'La promoción ha sido agregada exitosamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
          this.resetForm(); // Limpiar el formulario
        },
        (error) => {
          // Si ocurre un error
          this.errorMessage = 'Hubo un error al agregar la promoción. Intenta de nuevo.';
          Swal.fire({
            title: 'Error',
            text: 'Hubo un error al agregar la promoción. Por favor, intenta de nuevo.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
          console.error('Error al agregar la promoción', error); // Puedes agregar más lógica aquí si es necesario
        }
      );
    } else {
      // Si el formulario no es válido
      this.errorMessage = 'Por favor, complete todos los campos correctamente.';
      Swal.fire({
        title: 'Formulario incompleto',
        text: 'Por favor, completa todos los campos correctamente.',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      });
    }
  }

  // Validar si el formulario está completo
  isFormValid(): boolean {
    return (
      this.codigo_promocion.trim() !== '' &&
      this.descripcion.trim() !== '' &&
      this.descuento >= 1 &&
      this.descuento <= 100 &&
      this.fecha_inicio !== '' &&
      this.fecha_fin !== '' &&
      new Date(this.fecha_inicio) <= new Date(this.fecha_fin) // Verifica que la fecha de inicio sea antes que la fecha de fin
    );
  }

  // Limpiar el formulario y los mensajes
  resetForm() {
    this.codigo_promocion = '';
    this.descripcion = '';
    this.descuento = 0;
    this.fecha_inicio = '';
    this.fecha_fin = '';
    this.errorMessage = '';
    this.successMessage = '';
  }
}
