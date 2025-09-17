import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-car-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './add-car-modal.component.html',
  styleUrls: ['./add-car-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddCarModalComponent {
  @Output() close = new EventEmitter<void>();

  carForm: FormGroup;
  isClosing = false;

  constructor(private fb: FormBuilder) {
    this.carForm = this.fb.group({
      make: ['', Validators.required],
      model: ['', Validators.required],
      fuel: ['', Validators.required],
      transmission: ['', Validators.required],
      year: [2025, [Validators.required, Validators.min(1900)]],
      price: [0, [Validators.required, Validators.min(1)]],
      kilometers: [0, [Validators.required, Validators.min(0)]],
      color: ['', Validators.required],
      description: ['', Validators.required],
      images: ['']
    });
  }

  addCar() {
    if (this.carForm.valid) {

      

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
