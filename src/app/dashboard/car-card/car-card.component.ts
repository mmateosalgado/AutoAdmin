import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CarsService } from '../../data/services/car.service';

@Component({
  selector: 'app-car-card',
  imports: [CommonModule],
  templateUrl: './car-card.component.html',
  styleUrl: './car-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarCardComponent {
  @Input() car!: Car;
  @Output() editCar = new EventEmitter<Car>();
  @Output() editStatusCar = new EventEmitter<Car>();

  carService: CarsService = inject(CarsService);

  PublishOn(platform: string) {
    if (confirm(`Esta seguro que desea publicar este auto en ${platform}?`)) {
      this.carService.publishOn(this.car.id, platform, 'enabled').subscribe({
        next: () => alert(`Auto publicado en ${platform} con exito`),
        error: (err) => console.error('Publish failed', err)
      });
    }
  }

  DeleteCar() {
    if (confirm('Esta seguro que desea eliminar este auto?')) {
      this.carService.deleteCar(this.car.id).subscribe({
        next: () => alert('Auto eliminado con exito'),
        error: (err) => console.error('Delete failed', err)
      });
    }
  }

  EditCar() {
    this.editCar.emit(this.car);
  }

  EditStatusCar() {
    this.editStatusCar.emit(this.car);
  }
}