import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthRealService } from '../services/auth-real.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthRealService,
    private router: Router
  ) {}

  canActivate(): boolean {

    const token = this.authService.getToken();

    if (!token) {

      this.router.navigate(['/login']);
    
      console.warn("Acceso denegado. No se encontró un token de autenticación.");
      return false;

    }
    return true;
  }

}
