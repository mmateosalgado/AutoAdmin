import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from "../../core/header/header.component";
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [ReactiveFormsModule, HeaderComponent]
})
export class ProfileComponent {

  openAccordion: string | null = null;
  authService: AuthService = inject(AuthService);
  router = inject(Router);

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleAccordion(platform: string) {
    if (this.openAccordion === platform) {
      this.openAccordion = null;
    } else {
      this.openAccordion = platform;
    }
  }
}
