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

  async onSave(): Promise<void> {
    if (!this.car || !this.selectedStatus) return;

    const updatedCar = { ...this.car, status: this.selectedStatus };

    // Confirmación para autos vendidos
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

      try {
        // Reinicia estado de publicación y actualiza auto
        const resetCar = await this.CarService.resetPublishStatus(updatedCar.patent);
        if (!resetCar) throw new Error("No se pudo reiniciar el estado de publicación.");

        resetCar.status = this.selectedStatus;
        await this.CarService.updateCar(resetCar);

        console.log("updatedStatusCar:", resetCar);
        alert("Cambio de estado guardado exitosamente.");
      } catch (error) {
        console.error("Error al guardar estado:", error);
        alert("Ocurrió un error al actualizar el estado del auto.");
      }

      this.startClose();
      return;
    }

    // Caso general (no vendido)
    try {
      await this.CarService.updateCar(updatedCar);
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
