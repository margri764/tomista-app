import { Routes } from '@angular/router';

// dashboards
import { AppDashboard1Component } from './dashboard1/dashboard1.component';
import { FormCongressComponent } from '../form-congress/form-congress/form-congress.component';
import { ParticipantsComponent } from '../participants/participants/participants.component';
import { ConferenceComponent } from '../conference/conference/conference.component';
import { UserComponent } from '../user/user/user.component';
import { NotificationComponent } from '../notification/notification/notification.component';

export const DashboardsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'congressos', component: ConferenceComponent,  data: { title: 'Congressos' },
      },
      {
        path: 'registrados/:id', component: ParticipantsComponent,  data: { title: 'Registrados' },
      },
      {
        path: 'usuarios', component: UserComponent,  data: { title: 'Usuários' },
      },
      {
        path: 'notificacoes', component: NotificationComponent,  data: { title: 'Notificações' },
      },
    ],
  },
];
