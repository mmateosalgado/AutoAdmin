import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CarsService } from '../../data/services/car.service';
import { forkJoin } from 'rxjs';

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

  CarService: CarsService = inject(CarsService);


  isClosing = false;
  editedCar!: Car;

ngOnInit(): void {
  document.body.style.overflow = 'hidden';

  if (this.car) {
    this.editedCar = {
      ...this.car,
      publishStatus: this.car.publishStatus?.map(p => ({ ...p })) // ← copia profunda del array
    };
  }
}

  ngOnDestroy(): void {
    // Restaurar scroll del body
    document.body.style.overflow = '';
  }

  onSave() {
    if (!this.editedCar) return;

    if (JSON.stringify(this.editedCar) === JSON.stringify(this.car)) {
      alert("No se han realizado cambios");
      this.startClose();
      return;
    }

    // Detectar qué plataformas cambiaron y llamar publishOn por cada una
    const changedPublishes = this.editedCar.publishStatus?.filter(editedPub => {
      const original = this.car?.publishStatus?.find(p => p.platform === editedPub.platform);
      return original?.status !== editedPub.status;
    }) || [];

    const publishCalls = changedPublishes.map(pub =>
      this.CarService.publishOn(this.editedCar.id, pub.platform, pub.status as 'enabled' | 'disabled')
    );

    const updateCar$ = this.CarService.updateCar(this.editedCar);

    // Ejecutar todo junto
    forkJoin([...publishCalls, updateCar$]).subscribe({
      next: () => {
        alert("Auto actualizado exitosamente.");
        this.startClose();
      },
      error: () => {
        alert("Ocurrió un error al actualizar el auto.");
      }
    });
  }

  onClose() {
    this.startClose();
  }

  private startClose() {
    if (this.isClosing) return;
    this.isClosing = true;
    setTimeout(() => this.close.emit(), 300);
  }
}
