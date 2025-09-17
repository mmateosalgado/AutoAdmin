import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { CarCardComponent } from '../car-card/car-card.component';
import { CarsService } from '../../data/services/car.service';


@Component({
  selector: 'app-car-list',
  imports: [CarCardComponent],
  templateUrl: './car-list.component.html',
  styleUrl: './car-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarListComponent { 
  @Output() outputCar = new EventEmitter<Car>();
  @Output() close = new EventEmitter<void>();

  cars: Car[] = [];

  constructor(carService:CarsService) {
    this.cars = carService.getCars();
  }

  EditCar(car: Car) {
    this.outputCar.emit(car);
  }
}
