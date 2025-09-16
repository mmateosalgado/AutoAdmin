import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { CarCardComponent } from '../car-card/car-card.component';
import cars from "C:/Users/Usuario/AutoAdmin/src/app/temp-data/autos.json";

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

  cars: Car[] = cars;

  constructor() {}

  EditCar(car: Car) {
    this.outputCar.emit(car);
  }
}
