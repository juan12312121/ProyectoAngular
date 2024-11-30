import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NavbarComponent } from '../navbar/navbar.component';





@Component({
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,NavbarComponent],
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.css']
})
export default class EditarUsuarioComponent implements OnInit {
  editUserForm: FormGroup;
  userId!: number;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.editUserForm = this.fb.group({
      nombre_completo: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      direccion: ['']
    });
  }

  ngOnInit(): void {
    // Obtén el userId desde el token
    this.userId = this.authService.getUserId()!;  // Asegúrate de que el token esté presente
    if (this.userId) {
      this.loadUserData();
    } else {
      console.error('No se pudo obtener el ID del usuario desde el token');
    }
  }

  loadUserData(): void {
    this.authService.getUserById(this.userId).subscribe(
      (userData) => {
        this.editUserForm.patchValue({
          nombre_completo: userData.nombre_completo,
          correo: userData.correo,
          direccion: userData.direccion || ''  
        });
      },
      (error) => {
        console.error('Error al cargar los datos del usuario:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.editUserForm.invalid) {
      return;
    }

    const { nombre_completo, correo, direccion } = this.editUserForm.value;
    this.authService.updateUserData(this.userId, nombre_completo, correo, direccion).subscribe(
      (response) => {
        console.log('Usuario actualizado:', response);
        this.router.navigate(['/perfil']);
      },
      (error) => {
        console.error('Error al actualizar el usuario:', error);
      }
    );
  }
}
