import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CarsService } from '../../data/services/car.service';

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
    // Bloquear scroll del body
    document.body.style.overflow = 'hidden';

    if (this.car) {
      this.editedCar = { ...this.car };
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

    this.CarService.updateCar(this.editedCar).subscribe({
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
