import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    // Ruta para la sección de administración
    {
        path: 'admin',
        loadComponent: () => import('./admin/admin-dashboard/admin-dashboard.component'),
        canActivate: [AuthGuard],
    },
    // Ruta para Carros Registrados (protegida para administradores)
    {
        path: 'admin/carros-registrados',
        loadComponent: () => import('./admin/carros-registrados/carros-registrados.component'),
        canActivate: [AuthGuard],
    },
    // Ruta para Agregar Carro (protegida para administradores)
    {
        path: 'admin/agregar-carro',
        loadComponent: () => import('./admin/agregar-carro/agregar-carro.component'),
        canActivate: [AuthGuard], 
    },
    {
        path: 'admin/editar-carro/:id',
        loadComponent: () => import('./admin/editar-carro/editar-carro.component'),
        canActivate: [AuthGuard], 
      },

      {
        path: 'clientes',
        loadComponent: () => import('./admin/clientes/clientes.component'),
        canActivate: [AuthGuard], 
      },



    // Ruta para la sección de usuarios
    {
        path: 'usuario',
        loadComponent: () => import('./usuario/pagina-principal/pagina-principal.component'),
    },
    // Ruta para Carros
    {
        path: 'carros',
        loadComponent: () => import('./usuario/carros/carros.component'),
    },
    {
        path: 'login',
        loadComponent: () => import('./Auth/login/login.component'),
    },
    {
        path: 'registro',
        loadComponent: () => import('./Auth/registro/registro.component'),
    },
    {
        path: 'detalle-carro/:id',
        loadComponent: () => import('./usuario/detalle-carro/detalle-carro.component')
      },
    {
        path: 'historial-reservas', loadComponent: () => import('./usuario/historial/historial.component')
    },
    // Redirección a la página principal
    {
        path: '',
        redirectTo: 'usuario', // Redirige a la ruta de usuario
        pathMatch: 'full', // Asegura que la redirección solo ocurra si la ruta está vacía
    },
    // Ruta por defecto para manejar rutas no definidas
    {
        path: '**',
        redirectTo: 'usuario', // Redirige a la ruta de usuario para cualquier ruta no encontrada
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule { }
