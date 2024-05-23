import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { FormCongressComponent } from './pages/form-congress/form-congress/form-congress.component';

const routes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: '',
        redirectTo: '/autenticacao/login',
        // redirectTo: '/dashboards/dashboard1',
        pathMatch: 'full',
      },
      // {
      //   path: 'formulario',
      //   loadChildren: () =>
      //     import('./pages/pages.module').then((m) => m.PagesModule),
      // },
      {
        path: 'dashboards',
        loadChildren: () =>
          import('./pages/dashboards/dashboards.module').then(
            (m) => m.DashboardsModule
          ),
      },
     
  
     
    ],
  },
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: 'autenticacao',
        loadChildren: () =>
          import('./pages/authentication/authentication.module').then(
            (m) => m.AuthenticationModule
          ),
      },
    ],
  },

  {
    path: 'formulario', component: FormCongressComponent,  data: { title: 'Formulario' },

  },
  {
    path: '**',
    redirectTo: 'authentication/error',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
