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

  PublishOn(platform: string) {
    if (confirm(`Esta seguro que desea publicar este auto en ${platform}?`)) {
      this.carService.publishOn(this.car.patent, platform);
      alert(`Auto publicado en ${platform} con exito`);
    }
  }

  DeleteCar() {
    if (confirm("Esta seguro que desea eliminar este auto?")) {
      this.carService.deleteCar(this.car.patent);
      alert("Auto eliminado con exito");
    }
  }

  EditCar() {
    this.editCar.emit(this.car);
  }

  SubirHistoriaCar() {
    if (confirm("Esta seguro que desea publicar una historia en Instagram de este auto?")) {
      //this.carService.subirHistoriaInstagram(this.car.patent);
      alert("Historia publicada con exito");
    }
  }
}
