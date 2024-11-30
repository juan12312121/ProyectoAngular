import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';


@Component({
  selector: 'app-incidencias',
  standalone: true,
  imports: [SidebarComponent,CommonModule],
  templateUrl: './incidencias.component.html',
  styleUrl: './incidencias.component.css'
})
export default class IncidenciasComponent {

}
