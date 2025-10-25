import { Component, inject } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout-button',
  imports: [],
  templateUrl: './logout-button.component.html',
  styleUrl: './logout-button.component.scss'
})
export class LogoutButtonComponent {
    router = inject(Router);
    authService = inject(AuthService);

    logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
