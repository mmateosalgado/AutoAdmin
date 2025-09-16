import { ChangeDetectionStrategy, Component, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-toggle-dark-mode',
  imports: [],
  templateUrl: './toggleDarkMode.component.html',
  styleUrl: './toggleDarkMode.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToggleDarkModeComponent {
  isDarkMode = false;

  constructor(private renderer: Renderer2) {}

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;

    if (this.isDarkMode) {
      this.setTheme('#133efcff', '#ff0000ff'); // oscuro
    } else {
      this.setTheme('#f5f5f5', '#222'); // claro
    }
  }

  private setTheme(bg: string, text: string) {
    this.renderer.setStyle(document.documentElement, '--bg-color', bg);
    this.renderer.setStyle(document.documentElement, '--text-color', text);
  }
}
