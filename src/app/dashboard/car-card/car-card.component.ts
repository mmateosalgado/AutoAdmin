import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-car-card',
  imports: [CommonModule],
  templateUrl: './car-card.component.html',
  styleUrl: './car-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarCardComponent {
  @Input() car!: Car;
  @Output() editCar = new EventEmitter<Car>;

  DeleteCar() {
    console.log('Eliminar auto:', this.car);
  }

  EditCar() {
    this.editCar.emit(this.car);
  }
}
