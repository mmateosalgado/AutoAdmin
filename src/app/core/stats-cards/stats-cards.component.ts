import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CarsService } from '../../data/services/car.service';

@Component({
  selector: 'app-stats-cards',
  imports: [],
  templateUrl: './stats-cards.component.html',
  styleUrl: './stats-cards.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsCardsComponent {

  countData: CountData | null = null;

  constructor(carService:CarsService) {
    this.countData = carService.countDataCars();
  }

}
