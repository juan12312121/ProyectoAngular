import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

// Definimos una interfaz para la notificación
interface Notification {
  id: number;
  message: string;
  status: 'unread' | 'read';  // El estado solo puede ser 'unread' o 'read'
  type: 'reservation' | 'delivery' | 'rentalExpired' | 'payment';  // Tipo de notificación
}

@Component({
  selector: 'app-admin-notificaciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-notificaciones.component.html',
  styleUrls: ['./admin-notificaciones.component.css']
})
export class AdminNotificacionesComponent {

  // Usamos la interfaz Notification para definir el tipo del arreglo
  notifications: Notification[] = [
    { id: 1, message: "Nueva reserva de automóvil realizada.", status: 'unread', type: 'reservation' },
    { id: 2, message: "El automóvil ha sido entregado al cliente.", status: 'unread', type: 'delivery' },
    { id: 3, message: "La fecha de renta del automóvil ha pasado.", status: 'unread', type: 'rentalExpired' },
    { id: 4, message: "El cliente ha realizado el pago del automóvil.", status: 'unread', type: 'payment' }
  ];

  // Estado de la ventana emergente (notificaciones visibles o no)
  isNotificationsVisible = false;
  
  // Filtro de notificaciones
  notificationFilter: 'all' | 'reservation' | 'delivery' | 'rentalExpired' | 'payment' = 'all';

  // Función para obtener el número de notificaciones no leídas
  get unreadNotifications() {
    return this.notifications.filter(notification => notification.status === 'unread').length;
  }

  // Función para mostrar u ocultar las notificaciones
  toggleNotifications() {
    this.isNotificationsVisible = !this.isNotificationsVisible;
  }

  // Función para marcar una notificación como leída
  markAsRead(notification: Notification) {
    if (notification.status === 'unread') {
      notification.status = 'read';
      this.updateUnreadNotifications(); // Actualiza el contador de notificaciones no leídas
    }
  }

  // Filtra las notificaciones según el tipo seleccionado
  get filteredNotifications() {
    if (this.notificationFilter === 'all') {
      return this.notifications;
    }
    return this.notifications.filter(notification => notification.type === this.notificationFilter);
  }

  // Método para actualizar el contador de notificaciones no leídas
  private updateUnreadNotifications() {
    // Este método se puede usar para manejar cualquier lógica adicional
    // después de que una notificación es marcada como leída
    // como por ejemplo, actualizar un servicio o hacer otras operaciones.
  }
}
