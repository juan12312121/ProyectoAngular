import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [SidebarComponent], // Importa el SidebarComponent
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'] // Asegúrate de usar "styleUrls" en plural
})
export default class AdminDashboardComponent {

}
