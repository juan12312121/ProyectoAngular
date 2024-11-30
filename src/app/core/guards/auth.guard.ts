import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    // Verificar si el usuario está autenticado y si es admin o chofer
    if (this.authService.isAuthenticated()) {
      const role = this.authService.getUserRole();  // Supone que hay un método para obtener el rol del usuario
      if (role === 10 || role === 5) {
        return true; // Permite el acceso si es admin o chofer
      }
    }

    // Si no es admin ni chofer, redirigir a la página de usuario o login
    this.router.navigate(['/usuario']); // O redirige a una página de login si es necesario
    return false;
  }
}
