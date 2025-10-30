import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CarsService } from '../../data/services/car.service';
import { Observable } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { StatsCardComponent } from '../../stats-card/stats-card.component';

@Component({
  selector: 'app-stats-cards',
  imports: [AsyncPipe, CommonModule, StatsCardComponent],
  templateUrl: './stats-cards.component.html',
  styleUrls: ['./stats-cards.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsCardsComponent {
  private carsService = inject(CarsService);

  countData$: Observable<CountData> = this.carsService.countDataCars();

  onDelete(patent: string) {
    this.carsService.deleteCar(patent);
  }
}
