import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { CarrosService } from '../../core/services/carros.service';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-agregar-carro',
  standalone: true,
  imports: [SidebarComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './agregar-carro.component.html',
})
export default class AgregarCarroComponent {
  carForm: FormGroup;
  selectedFileName: string | null = null;
  imagePreviewUrl: string | null = null;
  isLoading = false; // Estado de carga
  modelos: string[] = [];





  constructor(private carrosService: CarrosService, private fb: FormBuilder) {
    this.carForm = this.fb.group({
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      anio: [null, [Validators.required, Validators.min(1886), Validators.max(new Date().getFullYear())]],
      color: ['', Validators.required],
      tipo_combustible: ['', Validators.required],
      precio_diaro: [null, [Validators.required, Validators.min(0)]],
      disponibilidad: ['', Validators.required],
      categoria: ['', Validators.required],
      imagen: [null, Validators.required],
      descripcion: ['', Validators.required],
      kilometraje: [null, [Validators.required, Validators.min(0)]],
      puertas: [null, [Validators.required, Validators.min(1)]],
      pasajeros: [null, [Validators.required, Validators.min(1)]],
    });

    this.carForm.get('marca')?.valueChanges.subscribe((marca) => {
   
      this.carForm.get('modelo')?.setValue('');
    });
  }




  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];

      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validImageTypes.includes(file.type) || file.size > 5 * 1024 * 1024) {
        this.showErrorAlert('Por favor, seleccione una imagen válida (JPEG, PNG, GIF) de menos de 5MB.');
        return;
      }

      this.carForm.patchValue({ imagen: file });
      this.selectedFileName = file.name;

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  private showErrorAlert(message: string): void {
    Swal.fire({
      title: 'Error!',
      text: message,
      icon: 'error',
      confirmButtonText: 'Aceptar',
    });
  }

  agregarCarro(event: Event): void {
    event.preventDefault();
    this.isLoading = true; // Establecer estado de carga
  
    if (this.carForm.invalid) {
      this.showErrorAlert('Por favor, complete todos los campos requeridos correctamente.');
      this.isLoading = false; // Reiniciar estado de carga en caso de error
      return;
    }
  
    const formData = new FormData();
    Object.keys(this.carForm.value).forEach(key => {
      formData.append(key, this.carForm.get(key)?.value);
    });
  
    // Log para ver los datos antes de enviarlos
    console.log('Datos que se enviarán:', this.carForm.value);
  
    this.carrosService.addCarro(formData).subscribe({
      next: () => {
        Swal.fire({
          title: 'Éxito!',
          text: 'Carro agregado exitosamente!',
          icon: 'success',
          confirmButtonText: 'Aceptar',
        });
        this.resetForm();
      },
      error: (err) => {
        this.isLoading = false; // Reiniciar estado de carga en caso de error
        this.handleServerError(err);
      },
      complete: () => {
        this.isLoading = false; // Asegurar que el estado de carga se restablezca al final
      }
    });
  }

  private handleServerError(err: any): void {
    let errorMessage = 'Ocurrió un error al agregar el carro. Inténtelo de nuevo más tarde.';
    if (err.status === 400) {
      errorMessage = 'Datos incorrectos. Verifique los campos y vuelva a intentarlo.';
    } else if (err.status === 500) {
      errorMessage = 'Error en el servidor. Intente de nuevo más tarde.';
    } else if (err.status === 0) {
      errorMessage = 'Error de conexión. Verifique su red e intente nuevamente.';
    }
    this.showErrorAlert(errorMessage);
  }

  private resetForm(): void {
    this.carForm.reset();
    this.selectedFileName = null;
    this.imagePreviewUrl = null;
  }


  
}
