import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { ToggleDarkModeComponent } from "../toggleDarkMode/toggleDarkMode.component";

@Component({
  selector: 'app-header',
  imports: [ToggleDarkModeComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {   
  @Output() addCar = new EventEmitter<void>();

  onAddCar() {
    this.addCar.emit();
  }
}
