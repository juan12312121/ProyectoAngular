import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; // Importar Router
import { NgxPaginationModule } from 'ngx-pagination';
import Swal from 'sweetalert2'; // Importar SweetAlert2
import { PromotionsService } from '../../core/services/promotions.service';
import { SidebarComponent } from '../sidebar/sidebar.component';


@Component({
  standalone: true,
  imports: [CommonModule, SidebarComponent, FormsModule,NgxPaginationModule],
  selector: 'app-promociones',
  templateUrl: './promociones.component.html',
  styleUrls: ['./promociones.component.css']
})
export default class PromocionesComponent implements OnInit {
addPromotion() {
this.router.navigate(['/anadir-promocion'])
}

promotions: any[] = []; // Array para almacenar las promociones
  currentPage: number = 1; // Página actual
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
  

  // Paginación
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadPromotions(); // Recargar promociones con la nueva página
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadPromotions(); // Recargar promociones con la nueva página
    }
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

  applyPromotion(promotionId: number) {
    console.log('Navegando a la vista de Aplicar Promoción con ID:', promotionId); // Verifica el ID
    if (promotionId) {
      this.router.navigate(['aplicar', promotionId]); // Asegúrate de que la ruta coincida
    } else {
      console.error('ID de la promoción no disponible');
    }
  }
  


  // Desactivar una promoción
  deactivatePromotion(idPromocion: number): void {
    const data = { idPromocion };
  
    this.promotionsService.deactivatePromotion(idPromocion).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Promoción desactivada',
          text: 'La promoción ha sido desactivada correctamente.',
          confirmButtonText: 'OK',
        });
  
        // Recargar las promociones si es necesario
        this.loadPromotions();
      },
      error: (err) => {
        console.error('Error al desactivar la promoción:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo desactivar la promoción. Intenta de nuevo más tarde.',
          confirmButtonText: 'OK',
        });
      },
    });
  }
  
  
  


  activatePromotion(promotionId: number) {
    this.promotionsService.activatePromotion(promotionId).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Promoción activada',
          text: 'La promoción ha sido activada correctamente.',
          confirmButtonText: 'OK'
        });
        this.loadPromotions(); // Recargar promociones después de activar
      },
      error: (err) => {
        console.error('Error al activar la promoción:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo activar la promoción. Intenta de nuevo más tarde.',
          confirmButtonText: 'OK'
        });
      }
    });
  }

}
