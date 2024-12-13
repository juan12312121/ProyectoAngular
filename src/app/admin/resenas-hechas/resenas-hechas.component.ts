import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { RatingService, Review } from '../../core/services/raiting.service';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-resenas-hechas',
  standalone: true,
  imports: [SidebarComponent, CommonModule, FormsModule],
  templateUrl: './resenas-hechas.component.html',
  styleUrls: ['./resenas-hechas.component.css']
})
export default class ResenasHechasComponent implements OnInit {

  reviews: Review[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  loading: boolean = true;
  errorMessage: string = '';
  searchTerm: string = '';

  constructor(private ratingService: RatingService) {}

  ngOnInit(): void {
    this.fetchReviews();
  }

  fetchReviews(): void {
    this.loading = true;

    this.ratingService.getAllRatings().pipe(
      catchError((error) => {
        this.loading = false;
        this.handleError(error, 'Error al cargar las reseñas. Intente de nuevo más tarde.');
        return of([]);  // Devuelve un array vacío en caso de error
      })
    ).subscribe({
      next: (reviews: Review[]) => {
        this.reviews = reviews;
        this.totalPages = Math.ceil(this.reviews.length / this.itemsPerPage);
        this.loading = false;
      },
    });
  }

  get filteredReviews() {
    return this.reviews.filter(review =>
      review.nombre_usuario.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      review.comentario.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  get paginatedReviews() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredReviews.slice(startIndex, endIndex);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  deleteReview(id: number) {
    if (id === undefined || id === null) {
      console.error('ID de la reseña no válido');
      return;
    }
    this.ratingService.deleteRating(id).pipe(
      catchError((error) => {
        console.error('Error al eliminar la reseña', error);
        this.handleError(error, 'No se pudo eliminar la reseña. Por favor, intente nuevamente.');
        return of(null);  // Devuelve null en caso de error
      })
    ).subscribe(
      () => {
        this.reviews = this.reviews.filter(review => review.id_valoracion !== id);
        this.totalPages = Math.ceil(this.reviews.length / this.itemsPerPage);
        Swal.fire('Eliminado', 'La reseña ha sido eliminada con éxito', 'success');
      }
    );
  }

  private handleError(error: any, message: string): void {
    // Muestra un error en la consola para depuración
    console.error('Error detallado:', error);

    // Muestra un mensaje amigable al usuario
    this.errorMessage = message;
    
    // Mostrar un alert detallado usando SweetAlert
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: message,
      footer: `Error: ${error.statusText || 'Desconocido'} - Código: ${error.status || 'N/A'}`,
    });
  }

  choferes = [
    { id: 1, nombre: 'Juan Pérez' },
    { id: 2, nombre: 'María Gómez' },
    { id: 3, nombre: 'Luis Ramírez' },
  ];
}
