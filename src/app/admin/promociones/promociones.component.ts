import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; // Importar Router
import Swal from 'sweetalert2'; // Importar SweetAlert2
import { PromotionsService } from '../../core/services/promotions.service';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  standalone: true,
  imports: [CommonModule, SidebarComponent, FormsModule],
  selector: 'app-promociones',
  templateUrl: './promociones.component.html',
  styleUrls: ['./promociones.component.css']
})
export default class PromocionesComponent implements OnInit {
addPromotion() {
this.router.navigate(['/anadir-promocion'])
}

promotions: any[] = []; // Array para almacenar las promociones
currentPage: number = 1;
promotionsPerPage: number = 10; // Número de promociones por página
totalPromotions: number = 0; // Total de promociones
totalPages: number = 0; // Total de páginas


  // Inyecta el Router aquí
  constructor(
    private promotionsService: PromotionsService,
    private router: Router  // Inyectar Router
  ) {}

  ngOnInit() {
    this.loadPromotions(); // Cargar promociones al iniciar el componente
  }

  // Método para cargar promociones desde el servicio
  loadPromotions() {
    this.promotionsService.getAllPromotions(this.currentPage, this.promotionsPerPage).subscribe({
      next: (data) => {
        console.log('Promociones obtenidas:', data); // Verificar los datos
        this.promotions = data; // Asignar promociones obtenidas
      },
      error: (err) => {
        console.error('Error al obtener promociones:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar las promociones. Intenta de nuevo más tarde.',
          confirmButtonText: 'OK'
        });
      }
    });
  }
  
  // Cambiar el estado de la promoción
  togglePromotionStatus(promotion: any) {
    console.log('Cambiando estado de la promoción:', promotion);

    if (!promotion.id_promocion) {
        console.error('Error: El ID de la promoción no está definido.', promotion);
        return;
    }

    // Convertir las fechas de formato ISO 8601 a objetos Date
    const currentDate = new Date();
    const startDate = new Date(promotion.fecha_inicio);
    const endDate = new Date(promotion.fecha_fin);

    // Lógica para alternar entre 'activo', 'inactivo', 'cancelado', o 'expirado'
    let newStatus: string;

    // Si la promoción está activa
    if (promotion.estado === 'activo') {
        // Si la fecha actual es posterior a la fecha de fin, cambiar a 'expirado'
        if (currentDate > endDate) {
            newStatus = 'expirado';
        } else {
            // Si la fecha no ha pasado, cambiar a 'inactivo' o 'cancelado'
            newStatus = 'inactivo'; // O 'cancelado' si es necesario
        }
    }
    // Si la promoción está inactiva o cancelada
    else if (promotion.estado === 'inactivo' || promotion.estado === 'cancelado') {
        // Si la fecha actual está dentro del rango de fechas, activarla
        if (currentDate >= startDate && currentDate <= endDate) {
            newStatus = 'activo';
        } else {
            // Si fuera del rango, mantener como 'inactivo' o 'cancelado'
            newStatus = promotion.estado; // Mantener el estado actual si fuera fuera del rango
        }
    } 
    // Si la promoción está expirada
    else if (promotion.estado === 'expirado') {
        // Si la fecha actual está antes de la fecha de fin, se puede volver a 'activo'
        if (currentDate <= endDate) {
            newStatus = 'activo';
        } else {
            newStatus = 'expirado'; // Mantener el estado expirao
        }
    } else {
        console.error('Estado desconocido de la promoción:', promotion.estado);
        return;
    }

    console.log('Nuevo estado a enviar:', newStatus);

    // Llamada a la API para actualizar el estado
    this.promotionsService.updatePromotionStatus(promotion.id_promocion, newStatus).subscribe({
        next: () => {
            // Actualizar el estado localmente en el array después de la actualización exitosa
            promotion.estado = newStatus;
            console.log('Estado actualizado localmente:', promotion.estado);
            Swal.fire({
                icon: 'success',
                title: 'Estado actualizado',
                text: 'El estado de la promoción ha sido actualizado correctamente.',
                confirmButtonText: 'OK'
            });
        },
        error: (err) => {
            console.error('Error al actualizar el estado:', err);
            // Revertir el cambio si hay un error
            promotion.estado = promotion.estado === 'activo' ? 'inactivo' : 'activo';
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo actualizar el estado de la promoción. Intenta de nuevo más tarde.',
                confirmButtonText: 'OK'
            });
        }
    });
  }

  // Paginación
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadPromotions(); // Recargar promociones con la nueva página
    }
  }

  nextPage() {
    this.currentPage++;
    this.loadPromotions(); // Recargar promociones con la nueva página
  }

  // Eliminar una promoción
  deletePromotion(promotionId: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.promotionsService.deletePromotion(promotionId).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Promoción eliminada',
              text: 'La promoción ha sido eliminada exitosamente.',
              confirmButtonText: 'OK'
            });
            this.loadPromotions(); // Recargar promociones después de eliminar
          },
          error: (err) => {
            console.error('Error al eliminar la promoción:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo eliminar la promoción. Intenta de nuevo más tarde.',
              confirmButtonText: 'OK'
            });
          }
        });
      }
    });
  }

  updatePromotion(promotion: any) {
    console.log('ID Promoción:', promotion.id_promocion);  // Verificar si el ID es correcto
    if (promotion.id_promocion) {
      this.router.navigate(['/acutalizar-promocion', promotion.id_promocion]);
    } else {
      console.error('ID de la promoción no disponible');
    }
  }
}
