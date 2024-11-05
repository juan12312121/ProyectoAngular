import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private LOGIN_URL = 'http://localhost:3500/usuario/login'; // URL de la API para login
  private REGISTER_URL = 'http://localhost:3500/usuario/registro'; // URL de la API para registro
  private tokenKey = 'authToken';
  private userRoleKey = 'userRole';

  constructor(private httpClient: HttpClient, private router: Router) {}

  // Método para login
  login(username: string, password: string): Observable<any> {
    return this.httpClient.post<any>(this.LOGIN_URL, { username, password }).pipe(
      tap(response => {
        if (response.token) {
          this.setToken(response.token);
          const decodedToken: any = this.decodeToken(response.token);
          if (decodedToken.rol) {
            this.setUserRole(decodedToken.rol);
            this.redirectUserBasedOnRole(decodedToken.rol);
          }
        }
      }),
      catchError(error => {
        const errorMessage = error.error?.message || 'Error en login. Inténtalo de nuevo.';
        console.error('Error en login:', errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  private redirectUserBasedOnRole(role: number): void {
    if (role === 10) { // Rol de administrador
      this.router.navigate(['/admin']);
    } else if (role === 1) { // Rol de usuario
      this.router.navigate(['/usuario']);
    } else {
      this.router.navigate(['/']); // Redirige a la página de inicio si no tiene rol definido
    }
  }

  // Método para registro
  register(nombreCompleto: string, username: string, correo: string, password: string, confirmarContrasena: string, rol: number): Observable<any> {
    if (password !== confirmarContrasena) {
      return throwError(() => new Error('Las contraseñas no coinciden'));
    }

    return this.httpClient.post<any>(this.REGISTER_URL, { nombreCompleto, username, correo, password, rol }).pipe(
      tap(response => {
        console.log('Registro exitoso:', response);
      }),
      catchError(error => {
        console.error('Error en el registro:', error);
        return throwError(() => new Error('Error en el registro'));
      })
    );
  }

  // Métodos para gestionar tokens y roles
  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private setUserRole(rol: number): void {
    localStorage.setItem(this.userRoleKey, rol.toString());
  }

  public getToken(): string | null {
    try {
      const token = localStorage.getItem(this.tokenKey);
      console.log('Token obtenido:', token); // Log para depuración
      return token;
    } catch (error) {
      console.error('Error al obtener el token:', error); // Manejo de errores
      return null; // Retornar null en caso de error
    }
  }

  private getUserRole(): number | null {
    const role = localStorage.getItem(this.userRoleKey);
    return role ? parseInt(role) : null;
  }

  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload)); // Decodificar el payload del token
    } catch (error) {
      console.error('Error al decodificar el token:', error); // Manejo de errores
      return null; // Retornar null en caso de error
    }
  }

  // Método para obtener el nombre del usuario
  getUserName(): string {
    const token = this.getToken();
    if (!token) {
      return 'Invitado'; // o lo que prefieras
    }

    const payload = this.decodeToken(token);
    return payload?.nombreCompleto || 'Invitado'; // Asegúrate de que este campo exista en tu token
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    try {
      const payload = this.decodeToken(token);
      const exp = payload?.exp * 1000; // Convertir segundos a milisegundos
      return Date.now() < exp;
    } catch (e) {
      console.error('Error al verificar autenticación:', e); // Manejo de errores
      return false;
    }
  }

  isAdmin(): boolean {
    return this.getUserRole() === 10; // Cambia este valor según tu lógica de rol
  }

  isUser(): boolean {
    return this.getUserRole() === 1; // Cambia este valor según tu lógica de rol
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userRoleKey);
    this.router.navigate(['/login']); // Redirigir a la página de login después de cerrar sesión
  }

  // Método para verificar si el usuario está autenticado
  isLoggedIn(): boolean {
    return this.isAuthenticated(); // Puedes reutilizar el método isAuthenticated
  }
}
