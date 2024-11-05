import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
//import Swal from 'sweetalert2'; // Importar SweetAlert2
//import { AuthService } from '../../core/services/auth.service'; // Actualiza la ruta de importación según sea necesario
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-pagina-principal',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './pagina-principal.component.html',
  styleUrls: ['./pagina-principal.component.css']
})
export default class PaginaPrincipalComponent {
 


}
