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
  @Output() countList = new EventEmitter<number>();

  cars: Car[] = [];
  countListCars:CountData|null = null;

  constructor(carService:CarsService) {

    // limpiar la suscripción anterior para evitar múltiples emisiones
    carService.getCars().subscribe(cars => {
      this.cars = cars;
    });
  }

  EditCar(car: Car) {
    this.outputCar.emit(car);
  }
}
