import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter,
  inject, Input, OnDestroy, OnInit, Output
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CarsService } from '../../data/services/car.service';
import { CloudinaryService } from '../../data/services/cloudinary.service';
import { UploadProgress } from '../../data/interfaces/cloudinary/upload-progress.interface';
import { forkJoin, Observable } from 'rxjs';

interface MediaItem {
  id?: number;           // undefined = nuevo (todavía no guardado en BD)
  url: string;
  publicId: string;
  resourceType: string;
  format: string;
  bytes: number;
  position: number;
  file?: File;           // solo para los nuevos
  uploading?: boolean;
  uploadProgress?: number;
  markedForDelete?: boolean;
}

@Component({
  selector: 'app-edit-car-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-car-modal.component.html',
  styleUrls: ['./edit-car-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditCarModalComponent implements OnInit, OnDestroy {
  @Input() car: Car | undefined;
  @Output() close = new EventEmitter<void>();

  carService: CarsService = inject(CarsService);
  cloudinaryService: CloudinaryService = inject(CloudinaryService);
  cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  isClosing = false;
  editedCar!: Car;
  mediaItems: MediaItem[] = [];

  // Drag & drop
  dragIndex: number | null = null;
  dragOverIndex: number | null = null;

  ngOnInit(): void {
    document.body.style.overflow = 'hidden';

    if (this.car) {
      this.editedCar = {
        ...this.car,
        publishStatus: this.car.publishStatus?.map(p => ({ ...p }))
      };

      this.mediaItems = (this.car.media ?? [])
        .sort((a, b) => a.position - b.position)
        .map(m => ({ ...m }));
    }
  }

  ngOnDestroy(): void {
    document.body.style.overflow = '';
    this.mediaItems
      .filter(m => m.file)
      .forEach(m => URL.revokeObjectURL(m.url));
  }

  // ── Media: agregar ──────────────────────────────────────────────────────────

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    this.addFiles(Array.from(input.files));
    input.value = '';
  }

  onDragOverZone(event: DragEvent): void {
    event.preventDefault();
  }

  onDropZone(event: DragEvent): void {
    event.preventDefault();
    const files = Array.from(event.dataTransfer?.files ?? []);
    this.addFiles(files);
  }

  private addFiles(files: File[]): void {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif',
      'video/mp4', 'video/webm', 'video/ogg'];
    const nextPosition = this.mediaItems.length;

    for (const file of files) {
      if (!allowed.includes(file.type)) continue;
      const previewUrl = URL.createObjectURL(file);
      this.mediaItems.push({
        url: previewUrl,
        publicId: '',
        resourceType: file.type.startsWith('image/') ? 'image' : 'video',
        format: file.name.split('.').pop() ?? '',
        bytes: file.size,
        position: nextPosition,
        file,
        uploading: false,
        uploadProgress: 0,
      });
    }
    this.cdr.markForCheck();
  }

  // ── Media: eliminar ─────────────────────────────────────────────────────────

  removeMedia(index: number): void {
    const item = this.mediaItems[index];
    if (item.id) {
      // Existente → marcar para borrar al guardar
      item.markedForDelete = true;
    } else {
      // Nuevo (no guardado aún) → sacar directo
      URL.revokeObjectURL(item.url);
      this.mediaItems.splice(index, 1);
    }
    this.cdr.markForCheck();
  }

  get visibleMedia(): MediaItem[] {
    return this.mediaItems.filter(m => !m.markedForDelete);
  }

  // ── Media: drag & drop reorder ──────────────────────────────────────────────

  onDragStart(index: number): void {
    this.dragIndex = index;
  }

  onDragOver(event: DragEvent, index: number): void {
    event.preventDefault();
    this.dragOverIndex = index;
    this.cdr.markForCheck();
  }

  onDrop(event: DragEvent, dropIndex: number): void {
    event.preventDefault();
    if (this.dragIndex === null || this.dragIndex === dropIndex) return;

    const visible = this.visibleMedia;
    const draggedItem = visible[this.dragIndex];
    const dropItem = visible[dropIndex];

    // Buscar los índices reales en mediaItems
    const realDragIndex = this.mediaItems.indexOf(draggedItem);
    const realDropIndex = this.mediaItems.indexOf(dropItem);

    // Mover en el array original
    this.mediaItems.splice(realDragIndex, 1);
    this.mediaItems.splice(realDropIndex, 0, draggedItem);

    // Reasignar posiciones
    this.mediaItems
      .filter(m => !m.markedForDelete)
      .forEach((item, i) => item.position = i);

    this.dragIndex = null;
    this.dragOverIndex = null;
    this.cdr.markForCheck();
  }
  onDragEnd(): void {
    this.dragIndex = null;
    this.dragOverIndex = null;
    this.cdr.markForCheck();
  }

  // ── Guardar ─────────────────────────────────────────────────────────────────

  onSave(): void {
    if (!this.editedCar) return;

    const noCarChanges = JSON.stringify({
      ...this.editedCar, publishStatus: [], media: []
    }) === JSON.stringify({
      ...this.car, publishStatus: [], media: []
    });

    const deletedItems = this.mediaItems.filter(m => m.id && m.markedForDelete);
    const newItems = this.mediaItems.filter(m => !m.id && !m.markedForDelete);
    const originalOrder = (this.car?.media ?? []).map(m => m.id).join(',');
    const currentOrder = this.visibleMedia.filter(m => m.id).map(m => m.id).join(',');
    const orderChanged = originalOrder !== currentOrder;

    const changedPublishes = this.editedCar.publishStatus?.filter(editedPub => {
      const original = this.car?.publishStatus?.find(p => p.platform === editedPub.platform);
      return original?.status !== editedPub.status;
    }) ?? [];

    const nothingChanged =
      noCarChanges &&
      changedPublishes.length === 0 &&
      deletedItems.length === 0 &&
      newItems.length === 0 &&
      !orderChanged;

    if (nothingChanged) {
      alert('No se han realizado cambios');
      this.startClose();
      return;
    }

    // 1. Subir nuevos archivos a Cloudinary primero
    if (newItems.length > 0) {
      this.uploadNewMedia(newItems, () => this.executeSave(changedPublishes, deletedItems, orderChanged));
    } else {
      this.executeSave(changedPublishes, deletedItems, orderChanged);
    }
  }

  private uploadNewMedia(items: MediaItem[], onComplete: () => void): void {
    let completed = 0;

    for (const item of items) {
      item.uploading = true;
      this.cdr.markForCheck();

      const upload$ = item.resourceType === 'image'
        ? this.cloudinaryService.uploadImage(item.file!, 'autos')
        : this.cloudinaryService.uploadVideo(item.file!, 'autos');

      upload$.subscribe({
        next: ({ progress, response }: UploadProgress) => {
          item.uploadProgress = progress;
          this.cdr.markForCheck();

          if (response) {
            item.publicId = response.public_id;
            item.url = response.secure_url;
            item.format = response.format;
            item.bytes = response.bytes;
            item.uploading = false;
            completed++;
            this.cdr.markForCheck();
            if (completed === items.length) onComplete();
          }
        },
        error: () => {
          item.uploading = false;
          item.markedForDelete = true; // si falla el upload, no intentar guardar
          completed++;
          this.cdr.markForCheck();
          if (completed === items.length) onComplete();
        }
      });
    }
  }

  private executeSave(
    changedPublishes: { platform: string; status: string }[],
    deletedItems: MediaItem[],
    orderChanged: boolean
  ): void {
    const calls: Observable<any>[] = [];

    // Update datos del auto
    calls.push(this.carService.updateCar(this.editedCar));

    // Publish changes
    changedPublishes.forEach(pub =>
      calls.push(this.carService.publishOn(this.editedCar.id, pub.platform, pub.status as 'enabled' | 'disabled'))
    );

    // Delete media
    deletedItems.forEach(item =>
      calls.push(this.carService.deleteCarMedia(this.editedCar.id, item.id!))
    );

    // Add new media
    const newItems = this.mediaItems.filter(m => !m.id && !m.markedForDelete && m.publicId);
    newItems.forEach(item =>
      calls.push(this.carService.addCarMedia(this.editedCar.id, {
        url: item.url,
        publicId: item.publicId,
        resourceType: item.resourceType,
        format: item.format,
        bytes: item.bytes,
      }))
    );

    // Reorder
    if (orderChanged || newItems.length > 0) {
      const order = this.visibleMedia
        .filter(m => m.id)
        .map((m, i) => ({ id: m.id!, position: i }));

      if (order.length > 0) {
        calls.push(this.carService.reorderCarMedia(this.editedCar.id, order));
      }
    }

    forkJoin(calls).subscribe({
      next: () => { 
        this.carService.getCars().subscribe(() => {
          alert('Auto actualizado exitosamente.');
          this.startClose();
        });
      },
      error: () => alert('Ocurrió un error al actualizar el auto.')
    });
  }

  onClose(): void {
    this.startClose();
  }

  private startClose(): void {
    if (this.isClosing) return;
    this.isClosing = true;
    setTimeout(() => this.close.emit(), 300);
  }
}