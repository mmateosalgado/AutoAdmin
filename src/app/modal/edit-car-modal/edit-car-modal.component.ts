import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from '@angular/core';
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
export class EditCarModalComponent {
  @Input() car: Car | undefined;
  @Output() close = new EventEmitter<void>();

  CarService: CarsService = inject(CarsService);


  isClosing = false;
  editedCar!: Car;

  ngOnInit(): void {
    if (this.car) {
      this.editedCar = { ...this.car };
    }
  }

  onSave() {
    if (!this.editedCar) return;
    this.CarService.updateCar(this.editedCar);
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
