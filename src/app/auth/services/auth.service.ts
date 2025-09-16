import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn = false;

  login(username: string, password: string): boolean {
    if (username === 'admin' && password === '1234') {
      this.isLoggedIn = true;
      localStorage.setItem('isLoggedIn', 'true');
      return true;
    }
    return false;
  }

  logout() {
    this.isLoggedIn = false;
    localStorage.removeItem('isLoggedIn');
  }

  getAuthStatus(): boolean {
    return this.isLoggedIn || localStorage.getItem('isLoggedIn') === 'true';
  }
}
