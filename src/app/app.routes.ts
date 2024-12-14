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

      {
        path: 'empleados',
        loadComponent: () => import('./admin/empleados/empleados.component'),
        canActivate: [AuthGuard],
      },

      {path:'reservas', loadComponent: () => import('./admin/reservas/reservas.component'), canActivate: [AuthGuard]},

      {path: 'agregar-empleados', loadComponent: () => import('./admin/registrar-empleados/registrar-empleados.component'), canActivate: [AuthGuard]},

      {path: 'promociones', loadComponent: () => import('./admin/promociones/promociones.component'), canActivate: [AuthGuard]},

      {path: 'anadir-promocion', loadComponent: () => import('./admin/anadir-promocion/anadir-promocion.component'),
        canActivate: [AuthGuard]
      },

      { path: 'acutalizar-promocion/:id', loadComponent: () => import('./admin/actualizar-promocion/actualizar-promocion.component'),
        canActivate: [AuthGuard]
      },

      {path: 'resenas', loadComponent: () => import('./admin/resenas-hechas/resenas-hechas.component'),
        canActivate: [AuthGuard]},

        { 
            path: 'carro-mantenimiento', 
            loadComponent: () => import('./admin/carros-matenimiento/carros-matenimiento.component'), 
            canActivate: [AuthGuard] 
          },

          
          { path: 'aplicar/:id_promocion', loadComponent: () => import('./admin/aplicar-promocion/aplicar-promocion.component'),
            canActivate: [AuthGuard]
           },
          
          {path: 'pagos-admin', loadComponent: () => import('./admin/pagos/pagos.component'),
            canActivate: [AuthGuard]
          },


    // Ruta para la sección de usuarios

    {path: 'pago/:id_reserva', loadComponent: () => import('./usuario/vista-pago/vista-pago.component')},

    {path: 'reportes/:id_reserva', loadComponent: () => import('./usuario/crear-reporte/crear-reporte.component')},

    {path: 'reportes-admin', loadComponent: () => import('./admin/reportes/reportes.component'),
      canActivate: [AuthGuard]
    },

    {path: 'detalle-reporte-admin/:id', loadComponent: () => import('./admin/detalle-reportes/detalle-reportes.component'),
      canActivate: [AuthGuard]
    },

    {path: 'reporte-chofer/:id_reserva', loadComponent: () => import('./choferes/reporte-chofer/reporte-chofer.component'), canActivate: [AuthGuard]},

    {path: 'detalle-renta/:id_reserva', loadComponent: () => import('./admin/detalle-reserva/detalle-reserva.component'), canActivate: [AuthGuard]},

    {path: 'detalle-renta-usuario/:id_reserva', loadComponent: () => import('./usuario/detalle-renta/detalle-renta.component')},

    {path: 'historial-usuarios-admin/:id', loadComponent: () => import('./admin/historial-usuarios/historial-usuarios.component'), canActivate: [AuthGuard]},

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
        path: 'reservas-usuario', loadComponent: () => import('./usuario/historial/historial.component')
    },
    {path: 'perfil', loadComponent: () => import('./usuario/perfil/perfil.component')},

    // Redirección a la página principal
   {
        path: '',
        redirectTo: 'login', // Redirige a la ruta de usuario
        pathMatch: 'full', // Asegura que la redirección solo ocurra si la ruta está vacía
    },
    // Ruta por defecto para manejar rutas no definidas
  // {
    //    path: '**',
      // redirectTo: 'usuario', // Redirige a la ruta de usuario para cualquier ruta no encontrada
    //},

  {path: 'chofer', loadComponent: () => import('./choferes/principal/principal.component')},
  {path: 'asignaciones', loadComponent: () => import('./choferes/reservas-asignadas/reservas-asignadas.component')},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule { }
