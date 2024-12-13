import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private LOGIN_URL = 'http://localhost:3500/usuario/login'; // URL de la API para login
  private REGISTER_URL = 'http://localhost:3500/usuario/registro'; // URL de la API para registro
  private USERS_BY_ROLE_URL = 'http://localhost:3500/usuario/role/';
  private BASE_URL = 'http://localhost:3500/usuario/';
  private BASE_URL2 = 'http://localhost:3500/usuario/choferes'


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

verHistorial(usuarioId: number): Observable<any> {
  if (!this.isTokenValid()) {
    return throwError(() => new Error('Token no válido o expirado.'));
  }

  const token = this.getToken();
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  // Realiza la solicitud GET para obtener el historial
  const url = `http://localhost:3500/usuario/historial/${usuarioId}`;
  return this.httpClient.get<any>(url, { headers }).pipe(
    tap(response => {
      console.log('Historial del usuario:', response);
    }),
    catchError(error => {
      console.error('Error al obtener historial:', error);
      return throwError(() => new Error('No se pudo obtener el historial.'));
    })
  );
}

getUserById(id: number): Observable<any> {
  const url = `http://localhost:3500/usuario/users/${id}`;
  const token = localStorage.getItem('authToken');  // Obtener el token de localStorage
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);  // Incluir el token en los encabezados

  return this.httpClient.get<any>(url, { headers }).pipe(
    tap(response => {
      console.log('Usuario obtenido:', response);
    }),
    catchError(error => {
      console.error('Error al obtener el usuario:', error);
      return throwError(() => new Error('No se pudo obtener el usuario.'));
    })
  );
}


getAllChoferes(): Observable<any> {
  // Obtener el token de localStorage
  const token = localStorage.getItem('authToken');
  
  // Verificar si el token existe
  if (!token) {
    console.error('No se encontró el token de autenticación');
    return throwError(() => new Error('No se encontró el token de autenticación'));
  }

  // Configuración de los headers con el token
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
  // Imprimir el token y los headers para depuración
  console.log('Obteniendo todos los choferes con token:', token);
  console.log('Headers:', headers);

  // Hacer la solicitud GET con los headers de autenticación
  return this.httpClient.get<any>(this.BASE_URL2, { headers }).pipe(
    tap(response => {
      console.log('Respuesta de los choferes:', response);  // Imprimir respuesta de la API
    }),
    catchError(error => {
      console.error('Error al obtener los choferes:', error);  // Imprimir error si ocurre
      return throwError(() => new Error('No se pudo obtener la lista de choferes.'));
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
      this.router.navigate(['/']); 
    }
  }

  getLoggedDriverId(): number | null {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        return decodedToken.id ?? null;  // Retorna el ID si existe, de lo contrario, null
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        return null;
      }
    }
    return null;
  }

  
  register(
    nombreCompleto: string,
    username: string,
    correo: string,
    password: string,
    confirmarContrasena: string,
    rol: number,
    numeroLicencia?: string // Hacerlo opcional
  ): Observable<any> {
    // Verificar si las contraseñas coinciden
    if (password !== confirmarContrasena) {
      return throwError(() => new Error('Las contraseñas no coinciden.'));
    }
  
    // Validar formato de correo (opcional)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(correo)) {
      return throwError(() => new Error('El correo electrónico no es válido.'));
    }
  
    // Asignar rol por defecto si no se proporciona
    const userRole = rol || 1;
  
    // Log para ver el valor de numeroLicencia
    console.log('Número de Licencia:', numeroLicencia);
  
    // Si el rol es 5, el número de licencia debe ser proporcionado
    if (userRole === 5 && !numeroLicencia) {
      return throwError(() => new Error('El número de licencia es requerido para usuarios de nivel 5.'));
    }
  
    // Llamar al backend para registrar al usuario
    return this.httpClient.post<any>(this.REGISTER_URL, { 
      nombreCompleto, 
      username, 
      correo, 
      password, 
      rol: userRole, 
      numeroLicencia: numeroLicencia || '' // Pasamos una cadena vacía si no hay número de licencia
    }).pipe(
      tap(response => {
        console.log('Registro exitoso:', response);
        // Realizar cualquier acción adicional después de un registro exitoso
        if (rol !== 10 && rol !== 5) {
          // Redirigir si no es rol admin o chofer
        //  this.router.navigate(['/login']);
        }
      }),
      catchError(error => {
        console.error('Error en el registro:', error);
        return throwError(() => new Error('Error al registrar el usuario.'));
      })
    );
  }
  
  
  
  isSessionActive(): boolean {
    const token = this.getToken();  // Obtener el token desde localStorage
    return token ? this.isAuthenticated() : false;  // Verificar si el token es válido
  }

  getUserProfile(): Observable<any> {
    const userId = this.getUserId();  // Obtener el ID del usuario desde el token o localStorage
    const token = this.getToken();
    
    if (!userId || !token) {
      return throwError(() => new Error('No se pudo obtener la información del perfil.'));
    }
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    // Suponemos que la API tiene un endpoint como '/usuario/{id}' para obtener el perfil del usuario
    const url = `http://localhost:3500/usuario/users/${userId}`;
  
    return this.httpClient.get<any>(url, { headers }).pipe(
      catchError(error => {
        console.error('Error al obtener el perfil:', error);
        return throwError(() => new Error('Error al obtener el perfil.'));
      })
    );
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

  updateUserData(id: number, nombreCompleto: string, nombreUsuario: string, correo: string): Observable<any> {
    const url = `${this.BASE_URL}/users/${id}`;  // Ruta a la API para actualizar los datos del usuario
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      return throwError(() => new Error('No se ha encontrado el token de autenticación'));
    }
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    // Enviar solo los datos necesarios (sin incluir el rol ni la dirección)
    return this.httpClient.put<any>(url, { nombre_completo: nombreCompleto, nombre_usuario: nombreUsuario, correo }, { headers }).pipe(
      tap(response => {
        console.log('Datos del usuario actualizados:', response);
      }),
      catchError(error => {
        console.error('Error al actualizar los datos del usuario:', error);
        return throwError(() => new Error('No se pudo actualizar los datos.'));
      })
    );
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

  

  public getUserRole(): number | null {
    const role = localStorage.getItem(this.userRoleKey);
    return role ? parseInt(role) : null;
  }

  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload)); // Decodifica el payload del token
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
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
      const exp = payload?.exp * 1000;  // Convertir segundos a milisegundos
      return Date.now() < exp;  // Verificar si el token no ha expirado
    } catch (e) {
      console.error('Error al verificar autenticación:', e);
      return false;
    }
  }

  isAdmin(): boolean {
    return this.getUserRole() === 10; // verificar si es admin
  }

  isUser(): boolean {
    return this.getUserRole() === 1; // verificar si es usuario
  }

  isChofer(): boolean {
    return this.getUserRole() === 5;
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
