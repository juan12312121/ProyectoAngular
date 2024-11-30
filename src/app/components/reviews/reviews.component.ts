import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { RatingService } from '../../core/services/raiting.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent implements OnInit, OnDestroy {
  loading = true;
  errorMessage = '';
  carId: number = 0;
  reviews: any[] = []; // Asegúrate de que reviews sea un array
  newReview = { rating: 0, comentario: '', usuario: 'Usuario Anónimo' };
  activeIndex = 0;
  private routeSubscription: Subscription | undefined;

  constructor(private ratingService: RatingService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe({
      next: (params) => {
        this.carId = +params['id']; // Get car ID from route params
        localStorage.setItem('carId', this.carId.toString()); // Store car ID in localStorage
        this.fetchReviews();
      },
      error: (err) => {
        console.error('Error in route params subscription:', err);
      }
    });
  }

  toggleCommentVisibility(review: any) {
    review.isExpanded = !review.isExpanded;
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe(); // Clean up subscription
  }

  limitText(text: string, maxLength: number): string {
    if (text.length > maxLength) {
      // Inserta un salto de línea después de la longitud máxima
      let limitedText = text.substring(0, maxLength) + '\n' + text.substring(maxLength);
      return limitedText;
    }
    return text;
  }

  fetchReviews(): void {
    console.log('Cargando reseñas...');
    this.ratingService.getAllRatings().subscribe({
      next: (reviews: any[]) => {
        console.log('Valoraciones obtenidas:', reviews);
  
        // Verifica si el campo 'nombre_usuario' está correctamente asignado
        reviews.forEach(review => {
          console.log('Nombre de usuario:', review.nombre_usuario);
        });
  
        // Asigna directamente el array de reseñas
        if (Array.isArray(reviews)) {
          this.reviews = reviews;
        } else {
          console.error('La respuesta no es un array:', reviews);
          this.reviews = []; // En caso de que no haya datos válidos
        }
  
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar las reseñas. Intente de nuevo más tarde.';
        this.loading = false;
        console.error('Error obteniendo reseñas:', error);
      }
    });
  }
  
  
  

  nextReview(): void {
    if (this.activeIndex < this.reviews.length - 1) {
      this.activeIndex++;
    } else {
      this.showNoMoreReviewsAlert();
    }
  }

  prevReview(): void {
    if (this.activeIndex > 0) {
      this.activeIndex--;
    } else {
      this.showNoMoreReviewsAlert();
    }
  }

  showNoMoreReviewsAlert(): void {
    Swal.fire({
      title: '¡No hay más reseñas!',
      text: 'Has alcanzado el final del carrusel.',
      icon: 'info',
      confirmButtonText: 'Entendido'
    });
  }

  setRating(rating: number): void {
    if (rating >= 1 && rating <= 5) {
      this.newReview.rating = rating;
    } else {
      alert('La calificación debe estar entre 1 y 5.');
    }
  }

  submitReview(): void {
    if (this.newReview.rating > 0 && this.newReview.comentario.trim()) {
      console.log('Enviando reseña para el carro con ID:', this.carId);
      this.ratingService.createRating(this.carId, this.newReview.rating, this.newReview.comentario).subscribe({
        next: (response: any) => {
          this.reviews = [...this.reviews, { ...this.newReview }]; // Add new review to array
          this.newReview = { rating: 0, comentario: '', usuario: 'Usuario Anónimo' }; // Reset form
          Swal.fire({
            title: '¡Reseña enviada!',
            text: 'Gracias por compartir tu opinión.',
            icon: 'success',
            confirmButtonText: 'Cerrar'
          });
        },
        error: (error: any) => {
          console.error('Error al enviar la reseña:', error);
          Swal.fire({
            title: 'Error',
            text: 'Hubo un problema al enviar tu valoración. Intenta de nuevo.',
            icon: 'error',
            confirmButtonText: 'Intentar de nuevo'
          });
        }
      });
    } else {
      Swal.fire({
        title: 'Error',
        text: 'Por favor, completa todos los campos antes de enviar tu valoración.',
        icon: 'error',
        confirmButtonText: 'Intentar de nuevo'
      });
    }
  }
}
