import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { CarCardComponent } from '../car-card/car-card.component';
import { CarsService } from '../../data/services/car.service';
import { EmptyStateComponent } from '../empty-state/empty-state.component';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-car-list',
  imports: [CarCardComponent, EmptyStateComponent,AsyncPipe],
  templateUrl: './car-list.component.html',
  styleUrl: './car-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarListComponent { 
  @Output() outputCar = new EventEmitter<Car>();
  @Output() close = new EventEmitter<void>();
  @Output() countList = new EventEmitter<number>();

  cars$: Observable<Car[]>;

  constructor(private carService: CarsService) {
    this.cars$ = this.carService.getCars();
  }

  EditCar(car: Car) {
    this.outputCar.emit(car);
  }
}
