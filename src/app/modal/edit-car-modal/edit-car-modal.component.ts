import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-edit-car-modal',
  templateUrl: './edit-car-modal.component.html',
  styleUrls: ['./edit-car-modal.component.css'], // <-- corregido
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditCarModalComponent implements OnInit {
  @Input() car: Car | null = null;
  @Output() close = new EventEmitter<void>();
  isClosing = false;

  constructor() {}

  ngOnInit(): void {
        console.log(this.car);
  }

  // no emitimos acá directo, sólo iniciamos la animación
  onClose() {
    this.startClose();
  }

  startClose() {
    if (this.isClosing) return; // evita dobles clicks
    this.isClosing = true;

    // espera el mismo tiempo que la animación CSS
    setTimeout(() => {
      this.close.emit();
    }, 300);
  }
}
