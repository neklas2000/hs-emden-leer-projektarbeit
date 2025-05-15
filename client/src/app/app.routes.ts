import { Routes } from '@angular/router';

import { LayoutComponent } from './components/layout/layout.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { HomeComponent } from './pages/home/home.component';
import { AuthComponent } from './components/auth/auth.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { DEFAULT_TITLE } from './common/default-title';
import { authenticationGuard } from './guards/authentication.guard';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: HomeComponent, title: DEFAULT_TITLE },
      { path: 'settings', component: SettingsComponent, title: 'Einstellungen', canActivate: [authenticationGuard] },
      {
        path: 'auth',
        component: AuthComponent,
        children: [
          { path: 'login', component: LoginComponent },
          { path: 'register', component: RegisterComponent },
        ],
      },
      {
        path: '**',
        component: PageNotFoundComponent,
        title: '404 - Page Not Found',
      },
    ],
  },
];
