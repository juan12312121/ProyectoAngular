import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GeminiService } from '../../services/gemini.service'; // Asegúrate de importar el servicio

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-chatbot',
  templateUrl: './chat-bot.component.html',
  animations: [
    trigger('slideAnimation', [
      state('void', style({ transform: 'translateY(100%)', opacity: 0 })),
      state('*', style({ transform: 'translateY(0)', opacity: 1 })),
      transition('void <=> *', animate('300ms ease-in-out')),
    ]),
  ],
})
export class ChatbotComponent {
  // Controla la visibilidad del chat
  isChatbotVisible: boolean = false;

  // Almacena los mensajes
  messages: { sender: string; text: string }[] = [];

  // Mensaje del usuario
  userMessage: string = '';

  constructor(private geminiService: GeminiService) {}

  // Alterna la visibilidad del chat
  toggleChatbot(): void {
    this.isChatbotVisible = !this.isChatbotVisible;
  }

  // Enviar un mensaje
  sendMessage(): void {
    if (this.userMessage.trim() !== '') {
      // Agregar el mensaje del usuario al historial
      this.messages.push({ sender: 'Tú', text: this.userMessage });

      // Llamar al servicio Gemini para obtener la respuesta
      this.geminiService.generateResponse(this.userMessage).subscribe(
        (response) => {
          // Agregar la respuesta de Gemini al historial de mensajes
          this.messages.push({ sender: 'Gemini', text: response.message });
        },
        (error) => {
          console.error('Error al generar respuesta:', error);
          this.messages.push({
            sender: 'Gemini',
            text: 'Hubo un error al generar la respuesta. Por favor, inténtalo de nuevo más tarde.',
          });
        }
      );

      // Limpiar el campo de texto
      this.userMessage = '';
    }
  }
}
