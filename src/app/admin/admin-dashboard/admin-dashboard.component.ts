import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';



@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [SidebarComponent,CommonModule], // Importa el SidebarComponent
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'] // Asegúrate de usar "styleUrls" en plural
})
export default class AdminDashboardComponent {

}
