import { Routes } from '@angular/router';

import { LayoutComponent } from './components/layout/layout.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: PageNotFoundComponent },
    ],
  },
  {
    path: '**',
    component: PageNotFoundComponent,
    title: '404 - Page Not Found'
  },
];
