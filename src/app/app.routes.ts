import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth/guard/auth.guard';
import { ProfileComponent } from './auth/profile/profile.component';
import { Routes } from '@angular/router';


export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'profile',component:ProfileComponent,canActivate:[AuthGuard]},
  { path: '**', redirectTo: '/login' }
];
