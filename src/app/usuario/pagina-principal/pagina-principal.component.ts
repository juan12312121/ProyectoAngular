import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatbotComponent } from "../../components/chat-bot/chat-bot.component";
import { NavbarComponent } from '../navbar/navbar.component';


@Component({
  selector: 'app-pagina-principal',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FormsModule, ChatbotComponent],
  templateUrl: './pagina-principal.component.html',
  styleUrls: ['./pagina-principal.component.css']
})
export default class PaginaPrincipalComponent {
  
}
