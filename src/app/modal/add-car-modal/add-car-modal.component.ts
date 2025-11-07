import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CarsService } from '../../data/services/car.service';

@Component({
  selector: 'app-add-car-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './add-car-modal.component.html',
  styleUrls: ['./add-car-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddCarModalComponent implements OnInit, OnDestroy {
  @Output() close = new EventEmitter<void>();

  addCarResp: boolean = true;
  car: Car | any;
  carForm: FormGroup;
  isClosing = false;

  constructor(private fb: FormBuilder, private carService: CarsService) {
    this.carForm = this.fb.group({
      make: ['', Validators.required],
      model: ['', Validators.required],
      fuel: ['', Validators.required],
      transmission: ['', Validators.required],
      year: [2025, [Validators.required, Validators.min(1900)]],
      price: [0, [Validators.required, Validators.min(1)]],
      kilometers: [0, [Validators.required, Validators.min(0)]],
      color: ['', Validators.required],
      patent: [0, [Validators.required, Validators.min(1)]],
      description: ['', Validators.required],
      images: ['']
    });
  }

  ngOnInit() {
    // Bloquear scroll del body
    document.body.style.overflow = 'hidden';
  }

  ngOnDestroy() {
    // Restaurar scroll del body
    document.body.style.overflow = '';
  }

  addCar() {
    if (this.carForm.valid) {
      this.car = this.carForm.value;
      this.car.status = 'disponible';

      const added = this.carService.addCar(this.car);

      if (!added) {
        alert("Esta patente ya existe. Por favor, ingrese una patente diferente.");
        return;
      }

      if (confirm(
        "¿Está seguro que desea agregar este auto? " +
        "La patente no se puede modificar luego! (" + this.car.patent + ")"
      )) {
        alert("Auto agregado con éxito");
      } else {
        // Si cancela, deshacer la inserción
        //TODO: Cuando se implemente el servicio de la api esta linea no es necesaria
        this.carService.deleteCar(this.car.patent);
        alert("Operación cancelada");
      }

      this.startClose();
    }
  }

  startClose() {
    this.isClosing = true;
    setTimeout(() => {
      this.close.emit();
    }, 300); // mismo tiempo que la animación CSS
  }

  onClose() {
    this.startClose();
  }
}
