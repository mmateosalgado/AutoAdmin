import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CarsService } from '../../data/services/car.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarStatus } from '../../data/interfaces/car-status.interface';

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
  selectedStatus: 'disponible' | 'reservado' | 'vendido' | '' = '';
  statuses: readonly ['disponible', 'reservado', 'vendido'] = ['disponible', 'reservado', 'vendido'];

  ngOnInit(): void {
    document.body.style.overflow = 'hidden';
    if (this.car) {
      this.selectedStatus = ['disponible', 'reservado', 'vendido'].includes(this.car.status)
        ? this.car.status as 'disponible' | 'reservado' | 'vendido'
        : '';
    }
  }

  ngOnDestroy(): void {
    document.body.style.overflow = '';
  }

  async onSave(): Promise<void> {

    if (!this.car || !this.selectedStatus) return;

    // Confirmación si pasa a Vendido
    if (this.selectedStatus === 'vendido') {

      const confirmed = confirm(
        "Al marcar este auto como vendido se marcará así en todos los lugares donde esté publicado. " +
        "ESTO NO SE PUEDE DESHACER. ¿Está seguro que desea continuar?"
      );

      if (!confirmed) {
        alert("Operación cancelada.");
        this.startClose();
        return;
      }
    }

    try {

      await this.CarService
        .editCarStatus(this.car.id, this.selectedStatus)
        .toPromise();

      alert("Cambio de estado guardado exitosamente.");

    } catch (error) {

      console.error("Error al guardar estado:", error);
      alert("Ocurrió un error al actualizar el estado del auto.");

    }

    this.startClose();
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
