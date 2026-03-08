import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component,
  EventEmitter, OnDestroy, OnInit, Output
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CarsService } from '../../data/services/car.service';
import { CloudinaryService } from '../../data/services/cloudinary.service';

import { finalize } from 'rxjs';
import { UploadProgress } from '../../data/interfaces/cloudinary/upload-progress.interface';

interface FilePreview {
  file: File;
  previewUrl: string;
  type: 'image' | 'video';
  uploading: boolean;
  progress: number;
  error: string;
}

@Component({
  selector: 'app-add-car-modal',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-car-modal.component.html',
  styleUrls: ['./add-car-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddCarModalComponent implements OnInit, OnDestroy {
  @Output() close = new EventEmitter<void>();

  addCarResp: boolean = true;
  carForm: FormGroup;
  isClosing = false;
  isSubmitting = false;

  previews: FilePreview[] = [];

  constructor(
    private fb: FormBuilder,
    private carService: CarsService,
    private cloudinaryService: CloudinaryService,
    private cdr: ChangeDetectorRef
  ) {
    this.carForm = this.fb.group({
      make:         ['', Validators.required],
      model:        ['', Validators.required],
      fuel:         ['', Validators.required],
      transmission: ['', Validators.required],
      year:         [2025, [Validators.required, Validators.min(1900)]],
      price:        [0,    [Validators.required, Validators.min(1)]],
      kilometers:   [0,    [Validators.required, Validators.min(0)]],
      color:        ['', Validators.required],
      patent:       ['', Validators.required],
      description:  ['', Validators.required],
    });
  }

  ngOnInit() {
    document.body.style.overflow = 'hidden';
  }

  ngOnDestroy() {
    document.body.style.overflow = '';
    // Liberar object URLs para no tener memory leaks
    this.previews.forEach(p => URL.revokeObjectURL(p.previewUrl));
  }

  // ── Manejo de archivos ──────────────────────────────────────────────────────

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    this.addFiles(Array.from(input.files));
    input.value = ''; // permite volver a seleccionar el mismo archivo
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const files = Array.from(event.dataTransfer?.files ?? []);
    this.addFiles(files);
  }

  removeFile(index: number): void {
    URL.revokeObjectURL(this.previews[index].previewUrl);
    this.previews.splice(index, 1);
    this.cdr.markForCheck();
  }

  // ── Submit ──────────────────────────────────────────────────────────────────

  addCar(): void {
    if (!this.carForm.valid) return;

    const car = { ...this.carForm.value, status: 'disponible' };

    if (!confirm(`¿Está seguro que desea agregar este auto? La patente no se puede modificar luego! (${car.patent})`)) {
      alert('Operación cancelada');
      return;
    }

    this.isSubmitting = true;

    this.carService.addCar(car).pipe(
      finalize(() => {
        this.isSubmitting = false;
        this.cdr.markForCheck();
      })
    ).subscribe({
      next: (response: any) => {
        const carId = response.id ?? response;

        if (this.previews.length > 0) {
          this.uploadAllMedia(carId);
        } else {
          alert('Auto agregado con éxito');
          this.startClose();
        }
      },
      error: (err) => {
        if (err.status === 409) {
          this.addCarResp = false;
          alert('Esta patente ya existe. Por favor, ingrese una patente diferente.');
        } else {
          alert('Error al agregar el auto. Intente nuevamente.');
        }
      }
    });
  }

  // ── Privados ────────────────────────────────────────────────────────────────

  private addFiles(files: File[]): void {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif',
                     'video/mp4', 'video/webm', 'video/ogg'];

    for (const file of files) {
      if (!allowed.includes(file.type)) continue;

      const type = file.type.startsWith('image/') ? 'image' : 'video';
      const previewUrl = URL.createObjectURL(file);

      this.previews.push({ file, previewUrl, type, uploading: false, progress: 0, error: '' });
    }

    this.cdr.markForCheck();
  }

  private uploadAllMedia(carId: number): void {
    let completed = 0;
    const total = this.previews.length;

    for (let i = 0; i < total; i++) {
      const preview = this.previews[i];
      preview.uploading = true;

      const upload$ = preview.type === 'image'
        ? this.cloudinaryService.uploadImage(preview.file, 'autos')
        : this.cloudinaryService.uploadVideo(preview.file, 'autos');

      upload$.subscribe({
        next: ({ progress, response }: UploadProgress) => {
          preview.progress = progress;
          this.cdr.markForCheck();

          if (response) {
            this.carService.addCarMedia(carId, {
              url:          response.secure_url,
              publicId:     response.public_id,
              resourceType: response.resource_type,
              format:       response.format,
              bytes:        response.bytes,
            }).subscribe({
              next: () => {
                preview.uploading = false;
                completed++;
                this.cdr.markForCheck();

                if (completed === total) {
                  alert('Auto e imágenes agregados con éxito');
                  this.startClose();
                }
              },
              error: () => {
                preview.error = 'Error al guardar en la API';
                preview.uploading = false;
                completed++;
                this.cdr.markForCheck();
              }
            });
          }
        },
        error: () => {
          preview.error = 'Error al subir a Cloudinary';
          preview.uploading = false;
          completed++;
          this.cdr.markForCheck();
        }
      });
    }
  }

  startClose(): void {
    this.isClosing = true;
    setTimeout(() => this.close.emit(), 300);
  }

  onClose(): void {
    this.startClose();
  }
}