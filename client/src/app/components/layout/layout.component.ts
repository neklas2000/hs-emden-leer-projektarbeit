import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { MatButtonModule } from '@angular/material/button';
import { I18nTextComponent } from '../i18n/i18n-text/i18n-text.component';
import { AuthenticationService } from '../../services/authentication.service';
import { SnackbarMessage, SnackbarService } from '../../services/snackbar.service';

type MobileQueries = {
  [breakpoint: string]: MediaQueryList;
};

type NavigationItem = {
  id: string;
  name: string;
  path: string;
  exact?: boolean;
  icon?: string;
  badge?: any;
  onClick?: (ev: MouseEvent) => void;
  requiresAuthentication?: boolean;
  shouldHide?: () => boolean;
};

type NavigationGroup = {
  id: string;
  name: string;
  children: NavigationItem[];
  requiresAuthentication?: boolean;
};

@Component({
  selector: 'hsel-layout',
  imports: [RouterModule, MatSidenavModule, MatDividerModule, MatListModule, MatIconModule, MatToolbarModule, HeaderComponent, FooterComponent, MatButtonModule, I18nTextComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  standalone: true,
})
export class LayoutComponent implements OnInit, OnDestroy {
  private readonly mobileQueryListener: VoidFunction;
  private readonly mobileQueries: MobileQueries;
  sidenavOpened = false;
  navigationGroups: NavigationGroup[] = [
    {
      id: 'nav-group-1',
      name: 'sidenav.general.name',
      requiresAuthentication: false,
      children: [
        {
          id: 'nav-group-1-item-1',
          name: 'sidenav.general.home',
          path: '/',
          exact: true,
          icon: 'home',
          requiresAuthentication: false,
        },
        {
          id: 'nav-group-1-item-2',
          name: 'sidenav.general.settings',
          path: '/settings',
          exact: true,
          icon: 'settings',
          requiresAuthentication: true,
        },
      ],
    },
    {
      id: 'nav-group-2',
      name: 'sidenav.account.name',
      requiresAuthentication: false,
      children: [
        {
          id: 'nav-group-2-item-1',
          name: 'sidenav.account.signin',
          path: '/auth/login',
          exact: true,
          icon: 'login',
          requiresAuthentication: false,
          shouldHide: () => this.isAuthenticated,
        },
        {
          id: 'nav-group-2-item-2',
          name: 'sidenav.account.signout',
          path: '/auth/signout',
          exact: false,
          icon: 'logout',
          requiresAuthentication: true,
          onClick: (ev) => {
            ev.preventDefault();
            ev.stopPropagation();

            this.signOut();
          },
        },
        {
          id: 'nav-group-2-item-3',
          name: 'sidenav.account.profile',
          path: '/profile',
          exact: true,
          icon: 'person',
          requiresAuthentication: true,
        },
      ],
    },
    {
      id: 'nav-group-3',
      name: 'sidenav.my-area.name',
      requiresAuthentication: true,
      children: [
        {
          id: 'nav-group-3-item-1',
          name: 'sidenav.my-area.projects',
          path: '/projects',
          exact: true,
          icon: 'folder',
          requiresAuthentication: true,
        },
        {
          id: 'nav-group-3-item-2',
          name: 'sidenav.my-area.gantt-chart',
          path: '/gantt-chart',
          exact: true,
          icon: 'view_timeline',
          requiresAuthentication: true,
        },
        {
          id: 'nav-group-3-item-3',
          name: 'sidenav.my-area.critical-path-analysis',
          path: '/critical-path-analysis',
          exact: true,
          icon: 'timeline',
          requiresAuthentication: true,
        },
      ],
    },
  ];

  constructor(
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly media: MediaMatcher,
    private readonly authentication: AuthenticationService,
    private readonly snackbar: SnackbarService,
  ) {
    this.mobileQueryListener = () => this.changeDetectorRef.detectChanges();
    this.mobileQueries = {
      'lt-xs': this.media.matchMedia('(max-width: 599.99px)'),
    };
  }

  ngOnInit(): void {
    for (const breakpoint in this.mobileQueries) {
      this.mobileQueries[breakpoint].addEventListener('change', this.mobileQueryListener);
    }
  }

  ngOnDestroy(): void {
    for (const breakpoint in this.mobileQueries) {
      this.mobileQueries[breakpoint].removeEventListener('change', this.mobileQueryListener);
    }
  }

  private signOut(): void {
    this.authentication.logout().subscribe({
      next: (successful) => {
        if (successful) {
          this.snackbar.info(SnackbarMessage.LOGOUT_SUCCESS);
        } else {
          this.snackbar.info(SnackbarMessage.LOGOUT_FAILURE);
        }
      },
    });
  }

  get isLowerThanXS(): boolean {
    return this.mobileQueries['lt-xs'].matches;
  }

  get isAuthenticated(): boolean {
    return this.authentication.isAuthenticated;
  }
}
