import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { CarrosService } from '../../core/services/carros.service';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-editar-carro',
  standalone: true,
  imports: [SidebarComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './editar-carro.component.html',
})
export default class EditarCarroComponent implements OnInit {
  carForm: FormGroup;
  isLoading = false;
  selectedFileName: string = '';
  id: number = 0;

  private readonly ERROR_MESSAGES = {
    required: 'Este campo es obligatorio.',
    min: (min: number) => `El valor mínimo es ${min}.`,
    max: (max: number) => `El valor máximo es ${max}.`,
    unsupportedFileType: 'Tipo de archivo no soportado. Por favor seleccione una imagen (JPG, PNG, GIF).',
  };

  constructor(
    private carrosService: CarrosService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.carForm = this.createFormGroup();
  }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadCarData(this.id);
  }

  private createFormGroup(): FormGroup {
    return this.fb.group({
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      anio: [null, [Validators.required, Validators.min(1886), Validators.max(new Date().getFullYear())]],
      color: ['', Validators.required],
      tipo_combustible: ['', Validators.required],
      precio_diaro: ['', [Validators.required, Validators.min(0)]],
      disponibilidad: ['', Validators.required],
      categoria: ['', Validators.required],
      descripcion: ['', Validators.required],
      kilometraje: [null, [Validators.required, Validators.min(0)]],
      puertas: [null, [Validators.required, Validators.min(1)]],
      pasajeros: [null, [Validators.required, Validators.min(1)]],
      imagen: [null],
    });
  }

  private loadCarData(id: number): void {
    this.isLoading = true;
    this.carrosService.getCarro(id).subscribe({
      next: (carData) => {
        this.carForm.patchValue(carData);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading car data:', error);
        this.showErrorAlert('Error al cargar los datos del carro: ' + error.message);
        this.isLoading = false;
      }
    });
  }

  editarCarro(event: Event): void {
    event.preventDefault();
    if (!this.validateForm()) return;

    this.isLoading = true;
    const formData = this.prepareFormData(this.carForm.value);

    this.carrosService.updateCar(this.id, formData).subscribe({
      next: () => {
        this.showSuccessAlert('Carro editado exitosamente!');
        this.resetForm();
      },
      error: (error: any) => {
        console.error('Error editing car:', error);
        this.showErrorAlert('Hubo un error al editar el carro. Por favor, intente de nuevo.');
      },
      complete: () => this.isLoading = false,
    });
  }

  private validateForm(): boolean {
    if (this.carForm.invalid) {
      this.showErrorAlert(this.ERROR_MESSAGES.required);
      return false;
    }
    return true;
  }

  private prepareFormData(currentFormValues: any): FormData {
    const formData = new FormData();
    Object.keys(currentFormValues).forEach(key => {
      formData.append(key, currentFormValues[key]);
    });
    return formData;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

      if (!allowedTypes.includes(file.type)) {
        this.showErrorAlert(this.ERROR_MESSAGES.unsupportedFileType);
        return;
      }

      this.selectedFileName = file.name;
      this.carForm.patchValue({ imagen: file });
    } else {
      this.selectedFileName = this.carForm.get('imagen')?.value || '';
    }
  }

  private showSuccessAlert(message: string): void {
    Swal.fire({
      title: 'Éxito!',
      text: message,
      icon: 'success',
      confirmButtonText: 'Aceptar'
    });
  }

  private showErrorAlert(message: string): void {
    Swal.fire({
      title: 'Error!',
      text: message,
      icon: 'error',
      confirmButtonText: 'Aceptar',
    });
  }

  private resetForm(): void {
    this.carForm.reset();
    this.selectedFileName = '';
    console.log('Form has been reset');
  }
}
