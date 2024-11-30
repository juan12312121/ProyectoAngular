import { Component } from '@angular/core';
import { SidebarChoferComponent } from '../sidebar-chofer/sidebar-chofer.component';


@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [SidebarChoferComponent],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css'
})
export default class PrincipalComponent {

}
