import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-edit-car-modal',
  imports: [],
  templateUrl: './edit-car-modal.component.html',
  styleUrl: './edit-car-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditCarModalComponent {
  @Input() car: Car | null = null;
  @Output() close = new EventEmitter<void>();

  constructor() {}

  onClose() {
    this.close.emit();
  }
}
