import { Routes } from '@angular/router';

import { AuthComponent } from '@Components/auth/auth.component';
import { LoginComponent } from '@Components/auth/login/login.component';
import { RegisterComponent } from '@Components/auth/register/register.component';
import { EditMilestoneEstimatesComponent } from '@Components/edit-milestone-estimates/edit-milestone-estimates.component';
import { HomeComponent } from '@Components/home/home.component';
import { LayoutComponent } from '@Components/layout/layout.component';
import { PageNotFoundComponent } from '@Components/page-not-found/page-not-found.component';
import { EditProjectComponent } from '@Components/user/edit-project/edit-project.component';
import { EditReportComponent } from '@Components/user/edit-report/edit-report.component';
import { NewProjectComponent } from '@Components/user/new-project/new-project.component';
import { NewReportComponent } from '@Components/user/new-report/new-report.component';
import { ProfileComponent } from '@Components/user/profile/profile.component';
import { ProjectDetailsComponent } from '@Components/user/project-details/project-details.component';
import { ProjectsComponent } from '@Components/user/projects/projects.component';
import { ReportDetailsComponent } from '@Components/user/report-details/report-details.component';
import { authenticationGuard } from '@Guards/authentication.guard';
import { projectExistsGuard } from '@Guards/project-exists.guard';
import { milestoneEstimatesEditResolver } from '@Resolvers/milestone-estimates-edit.resolver';
import { milestoneEstimatesProjectResolver } from '@Resolvers/milestone-estimates-project.resolver';
import { profileResolver } from '@Resolvers/profile.resolver';
import { projectDetailsResolver } from '@Resolvers/project-details.resolver';
import { projectEditResolver } from '@Resolvers/project-edit.resolver';
import { reportDetailsResolver } from '@Resolvers/report-details.resolver';
import { reportEditResolver } from '@Resolvers/report-edit.resolver';
import { userProjectsResolver } from '@Resolvers/user-projects.resolver';

/**
 * @description
 * These routes are used by the `Router` to direct an user through the web application and it's
 * pages.
 */
export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
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
        resolve: {
          profile: profileResolver,
        },
        canActivate: [authenticationGuard],
      },
      {
        path: 'projects',
        component: ProjectsComponent,
        title: 'Meine Projekte',
        resolve: {
          projects: userProjectsResolver,
          profile: profileResolver,
        },
        canActivate: [authenticationGuard],
      },
      {
        path: 'projects/new',
        component: NewProjectComponent,
        title: 'Neues Projekt',
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
        path: 'projects/:id/milestones/edit',
        component: EditMilestoneEstimatesComponent,
        title: 'Meilensteinprognosen bearbeiten',
        resolve: {
          milestones: milestoneEstimatesEditResolver,
          project: milestoneEstimatesProjectResolver(),
        },
        canActivate: [authenticationGuard],
      },
      {
        path: 'projects/:projectId/report/new',
        component: NewReportComponent,
        title: 'Projektbericht erstellen',
        resolve: {
          project: milestoneEstimatesProjectResolver('projectId'),
        },
        canActivate: [authenticationGuard, projectExistsGuard],
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
      {
        path: '**',
        component: PageNotFoundComponent,
        title: '404 - Page Not Found',
      },
    ],
  },
];
