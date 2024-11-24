import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2'; // Importar SweetAlert2
import { PromotionsService } from '../../core/services/promotions.service'; // Asegúrate de que esta ruta sea correcta
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-actualizar-promocion',
  standalone: true,
  imports: [SidebarComponent,CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './actualizar-promocion.component.html',
  styleUrls: ['./actualizar-promocion.component.css']
})
export default class ActualizarPromocionComponent implements OnInit {
  // Variables para el formulario
  codigo_promocion: string = '';
  descripcion: string = '';
  descuento: number = 0;
  fecha_inicio: string = '';
  fecha_fin: string = '';
  promotionId: number = 0; // Para almacenar el id de la promoción

  // Mensajes de error y éxito
  errorMessage: string = '';
  successMessage: string = '';
  promotionForm: any;

  // Inyección del servicio de promociones y ActivatedRoute para obtener el ID de la URL
  constructor(
    private promocionesService: PromotionsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // Obtener el id de la promoción desde la URL
    this.promotionId = Number(this.route.snapshot.paramMap.get('id'));

    // Llamar al servicio para obtener los detalles de la promoción
    this.promocionesService.getPromotionById(this.promotionId).subscribe(
      (promotion) => {
        this.codigo_promocion = promotion.codigo_promocion;
        this.descripcion = promotion.descripcion;
        this.descuento = promotion.descuento;
        this.fecha_inicio = promotion.fecha_inicio;
        this.fecha_fin = promotion.fecha_fin;
      },
      (error) => {
        console.error('Error al cargar la promoción', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo cargar los detalles de la promoción.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    );
  }

  // Método para manejar el envío del formulario
  onSubmit() {
    if (this.isFormValid()) {
      // Llamada al servicio para actualizar la promoción
      this.promocionesService.updatePromotion(
        this.promotionId,
        this.codigo_promocion,
        this.descripcion,
        this.descuento,
        this.fecha_inicio,
        this.fecha_fin
      ).subscribe(
        (response) => {
          // Si la actualización es exitosa
          this.successMessage = 'Promoción actualizada exitosamente';
          Swal.fire({
            title: '¡Éxito!',
            text: 'La promoción ha sido actualizada exitosamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
          this.router.navigate(['/promociones']); // Redirigir a la lista de promociones
        },
        (error) => {
          // Si ocurre un error
          this.errorMessage = 'Hubo un error al actualizar la promoción. Intenta de nuevo.';
          Swal.fire({
            title: 'Error',
            text: 'Hubo un error al actualizar la promoción. Por favor, intenta de nuevo.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
          console.error('Error al actualizar la promoción', error);
        }
      );
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
}
