import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from "../../core/header/header.component";
import { LogoutButtonComponent } from "../../core/logout-button/logout-button.component";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  imports: [ReactiveFormsModule, HeaderComponent, LogoutButtonComponent]
})
export class ProfileComponent {
  openAccordion: string | null = null;

  toggleAccordion(platform: string) {
    if (this.openAccordion === platform) {
      this.openAccordion = null;
    } else {
      this.openAccordion = platform;
    }
  }
}
