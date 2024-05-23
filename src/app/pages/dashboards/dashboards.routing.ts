import { Routes } from '@angular/router';

// dashboards
import { AppDashboard1Component } from './dashboard1/dashboard1.component';
import { FormCongressComponent } from '../form-congress/form-congress/form-congress.component';

export const DashboardsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'dashboard1',
        component: AppDashboard1Component,
        data: {
          title: 'Analytical',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Analytical' },
          ],
        },
      },
      {
        // path: 'formulario', component: FormCongressComponent,  data: { title: 'Formulario' },
      }
     
    ],
  },
];
