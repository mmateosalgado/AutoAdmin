import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthRealService } from '../services/auth-real.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class LoginComponent {

  username = '';
  password = '';
  errorMessage = '';

  constructor(
    private authService: AuthRealService,
    private router: Router
  ) { }

  onSubmit() {

    this.authService.login(this.username, this.password)
      .subscribe({
        next: () => {
          this.router.navigate(['/home']);
        },

        error: () => {
          this.errorMessage = 'Usuario o contraseña incorrectos';
        }
      });
  }
}
