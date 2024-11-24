import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private LOGIN_URL = 'http://localhost:3500/usuario/login'; // URL de la API para login
  private REGISTER_URL = 'http://localhost:3500/usuario/registro'; // URL de la API para registro
  private USERS_BY_ROLE_URL = 'http://localhost:3500/usuario/usuario/role/';
  private userId: number | null = null;

  private tokenKey = 'authToken';
  private userRoleKey = 'userRole';

  constructor(private httpClient: HttpClient, private router: Router) {}

// Método para eliminar un usuario
deleteUser(id: number): Observable<any> {
  const url = `http://localhost:3500/usuario/users/${id}`;  // Cambia aquí para incluir '/usuario'
  const token = localStorage.getItem('authToken');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  return this.httpClient.delete<any>(url, { headers }).pipe(
    tap(response => {
      console.log('Usuario eliminado:', response);
    }),
    catchError(error => {
      console.error('Error al eliminar el usuario:', error);
      return throwError(() => new Error('No se pudo eliminar el usuario.'));
    })
  );
}




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

  register(nombreCompleto: string, username: string, correo: string, password: string, confirmarContrasena: string, rol: number): Observable<any> {
    const userRole = this.getUserRole();  // Obtenemos el rol del usuario que está realizando el registro
  
    // Verificamos que las contraseñas coincidan
    if (password !== confirmarContrasena) {
      return throwError(() => new Error('Las contraseñas no coinciden'));
    }
  
    // Lógica para usuarios con rol 10 (administrador)
    if (userRole === 10) {
      // Los administradores pueden registrar con cualquier rol
      return this.httpClient.post<any>(this.REGISTER_URL, { nombreCompleto, username, correo, password, rol }).pipe(
        tap(response => {
          console.log('Registro exitoso:', response);
          this.router.navigate(['/login']); // Redirigir al login después de un registro exitoso
        }),
        catchError(error => {
          console.error('Error en el registro:', error);
          return throwError(() => new Error('Error en el registro'));
        })
      );
    }
  
    // Lógica para usuarios con rol 1 (usuarios normales)
    if (userRole === 1) {
      // Los usuarios solo pueden registrarse a sí mismos (rol 1)
      if (rol !== 1) {
        return throwError(() => new Error('Solo puedes registrarte con tu propio rol.'));
      }
  
      return this.httpClient.post<any>(this.REGISTER_URL, { nombreCompleto, username, correo, password, rol }).pipe(
        tap(response => {
          console.log('Registro exitoso:', response);
          this.router.navigate(['/login']); // Redirigir al login después de un registro exitoso
        }),
        catchError(error => {
          console.error('Error en el registro:', error);
          return throwError(() => new Error('Error en el registro'));
        })
      );
    }
  
    // Si el rol no es 1 ni 10, devolver un error
    return throwError(() => new Error('Acción no permitida.'));
  }
  


  getUsersByRole(role: number): Observable<any> {
    const url = `${this.USERS_BY_ROLE_URL}${role}`;
    const token = localStorage.getItem('authToken');  // Retrieve token from localStorage or sessionStorage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);  // Include token in the request header

    return this.httpClient.get<any>(url, { headers }).pipe(
      catchError(error => {
        console.error('Error al obtener los usuarios:', error);
        return throwError(() => new Error('No se pudo obtener los usuarios.'));
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
    return this.getUserRole() === 10; // verificar si es admin
  }

  isUser(): boolean {
    return this.getUserRole() === 1; // verificar si es usuario
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

  getUserId(): number | null {
    return this.userId || (localStorage.getItem('userId') ? parseInt(localStorage.getItem('userId')!) : null);
  }

  // Método para verificar si el token es válido
  isTokenValid(): boolean {
    const token = this.getToken();
    return token ? this.isAuthenticated() : false;
  }

  setUserId(userId: number): void {
    this.userId = userId;  // Asignamos el userId como número
    localStorage.setItem('userId', userId.toString());  // Guardamos como cadena en localStorage
  }

  
 
  

 
}
