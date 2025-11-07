import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CarsService } from '../../data/services/car.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-status-car-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './status-car-modal.html',
  styleUrl: './status-car-modal.css'
})
export class StatusCarModal {
  @Input() car: Car | undefined;
  @Output() close = new EventEmitter<void>();

  CarService: CarsService = inject(CarsService);

  isClosing = false;
  selectedStatus: string = '';

  statuses = ['disponible', 'reservado', 'vendido'];

  ngOnInit(): void {
    document.body.style.overflow = 'hidden';
    if (this.car) {
      this.selectedStatus = this.car.status ?? '';
    }
  }

  ngOnDestroy(): void {
    document.body.style.overflow = '';
  }

  onSave() {
    if (!this.car || !this.selectedStatus) return;

    const updatedCar = {
      ...this.car,
      status: this.selectedStatus,
    };

    if (this.selectedStatus === 'vendido') {
      if (confirm(
        "Al marcar este auto como vendido se marcara asi en todos los lugares que este publicado, " +
        "ESTO NO SE PUEDE DESHACER. ¿Está seguro que desea continuar?"
      )) {
        alert("Cambio de estado guardado exitosamente.");
        this.CarService.updateCar(updatedCar);
      } else {
        alert("Operación cancelada");
      }

      this.CarService.updateCar(updatedCar);
      this.startClose();
    } else {
      this.CarService.updateCar(updatedCar);
      alert("Cambio de estado guardado exitosamente.");
      this.startClose();
    }
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
