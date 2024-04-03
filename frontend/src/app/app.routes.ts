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
import { authenticationGuard } from './guards/authentication.guard';
import { NewProjectComponent } from './components/user/new-project/new-project.component';
import { EditProjectComponent } from './components/user/edit-project/edit-project.component';
import { projectEditResolver } from './resolvers/project-edit.resolver';
import { EditMilestoneEstimatesComponent } from './components/edit-milestone-estimates/edit-milestone-estimates.component';
import { milestoneEstimatesEditResolver } from './resolvers/milestone-estimates-edit.resolver';
import { milestoneEstimatesProjectResolver } from './resolvers/milestone-estimates-project.resolver';
import { NewReportComponent } from './components/user/new-report/new-report.component';
import { EditReportComponent } from './components/user/edit-report/edit-report.component';
import { reportEditResolver } from './resolvers/report-edit.resolver';

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
