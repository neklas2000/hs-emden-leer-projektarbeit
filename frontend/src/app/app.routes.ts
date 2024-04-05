import { Routes } from '@angular/router';

import {
  AuthComponent,
  EditMilestoneEstimatesComponent,
  EditProjectComponent,
  EditReportComponent,
  HomeComponent,
  LayoutComponent,
  LoginComponent,
  NewProjectComponent,
  NewReportComponent,
  ProfileComponent,
  ProjectDetailsComponent,
  ProjectsComponent,
  RegisterComponent,
  ReportDetailsComponent,
} from '@Components';
import { authenticationGuard } from '@Guards/authentication.guard';
import {
  layoutLogoResolver,
  milestoneEstimatesEditResolver,
  milestoneEstimatesProjectResolver,
  projectDetailsResolver,
  projectEditResolver,
  reportDetailsResolver,
  reportEditResolver,
  userProjectsResolver,
} from '@Resolvers';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    resolve: {
      logo: layoutLogoResolver,
    },
    children: [
      {
        path: '',
        component: HomeComponent,
        title: 'HS Emden/Leer - MTA',
      },
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
      {
        path: 'profile',
        component: ProfileComponent,
        title: 'Mein Profil',
        canActivate: [authenticationGuard],
      },
      {
        path: 'projects',
        component: ProjectsComponent,
        title: 'Meine Projekte',
        resolve: {
          projects: userProjectsResolver,
        },
        canActivate: [authenticationGuard],
      },
      {
        path: 'projects/new',
        component: NewProjectComponent,
        title: 'Neues Projekte',
        canActivate: [authenticationGuard],
      },
      {
        path: 'projects/:id',
        component: ProjectDetailsComponent,
        title: 'Projektdetails',
        resolve: {
          project: projectDetailsResolver,
        },
        canActivate: [authenticationGuard],
      },
      {
        path: 'projects/:id/edit',
        component: EditProjectComponent,
        title: 'Projekt bearbeiten',
        resolve: {
          project: projectEditResolver,
        },
        canActivate: [authenticationGuard],
      },
      {
        path: 'projects/:id/estimates/edit',
        component: EditMilestoneEstimatesComponent,
        title: 'Meilensteinprognosen bearbeiten',
        resolve: {
          milestones: milestoneEstimatesEditResolver,
          project: milestoneEstimatesProjectResolver,
        },
        canActivate: [authenticationGuard],
      },
      {
        path: 'projects/:projectId/report/new',
        component: NewReportComponent,
        title: 'Projektbericht erstellen',
        canActivate: [authenticationGuard],
      },
      {
        path: 'projects/:projectId/report/:reportId',
        component: ReportDetailsComponent,
        title: 'Projektbericht Details',
        resolve: {
          report: reportDetailsResolver,
        },
        canActivate: [authenticationGuard],
      },
      {
        path: 'projects/:projectId/report/:reportId/edit',
        component: EditReportComponent,
        title: 'Projektbericht bearbeiten',
        resolve: {
          report: reportEditResolver,
        },
        canActivate: [authenticationGuard],
      },
    ],
  },
];
