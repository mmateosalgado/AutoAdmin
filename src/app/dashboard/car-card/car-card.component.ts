import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CarsService } from '../../data/services/car.service';

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

  carService: CarsService = inject(CarsService);

  DeleteCar() {
    this.carService.deleteCar(this.car.patent);
  }

  EditCar() {
    this.editCar.emit(this.car);
  }
}
