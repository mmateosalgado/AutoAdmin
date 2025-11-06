import { Component, inject } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';

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
