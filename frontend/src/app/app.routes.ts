import { Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { AuthComponent } from './components/auth/auth.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { ProjectsComponent } from './components/user/projects/projects.component';
import { ProfileComponent } from './components/user/profile/profile.component';
import { LayoutComponent } from './components/layout/layout.component';
import { ProjectDetailsComponent } from './components/user/project-details/project-details.component';
import { projectDetailsResolver } from './resolvers/project-details.resolver';
import { layoutLogoResolver } from './resolvers/layout-logo.resolver';
import { userProjectsResolver } from './resolvers/user-projects.resolver';
import { ReportDetailsComponent } from './components/user/report-details/report-details.component';
import { reportDetailsResolver } from './resolvers/report-details.resolver';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    resolve: {
      logo: layoutLogoResolver,
    },
    children: [
      { path: '', component: HomeComponent, title: 'HS Emden/Leer - MTA' },
      {
        path: 'auth',
        component: AuthComponent,
        children: [
          {
            path: 'login',
            component: LoginComponent,
            title: 'Anmelden',
            resolve: {
              logo: layoutLogoResolver,
            },
          },
          {
            path: 'register',
            component: RegisterComponent,
            title: 'Registrieren',
          },
        ],
      },
      { path: 'profile', component: ProfileComponent, title: 'Mein Profil' },
      {
        path: 'projects',
        component: ProjectsComponent,
        title: 'Meine Projekte',
        resolve: {
          projects: userProjectsResolver,
        },
      },
      {
        path: 'projects/:id',
        component: ProjectDetailsComponent,
        title: 'Projektdetails',
        resolve: {
          project: projectDetailsResolver
        }
      },
      {
        path: 'projects/:projectId/report/:reportId',
        component: ReportDetailsComponent,
        title: 'Projektbericht Details',
        resolve: {
          report: reportDetailsResolver,
        },
      },
    ],
  },
];
