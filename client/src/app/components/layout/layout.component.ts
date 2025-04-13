import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';

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
  imports: [RouterModule, MatSidenavModule, MatDividerModule, MatListModule, MatIconModule, MatToolbarModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  standalone: true,
})
export class LayoutComponent implements OnInit, OnDestroy {
  private readonly mobileQueryListener: VoidFunction;
  private readonly mobileQueries: MobileQueries;
  navigationGroups: NavigationGroup[] = [
    {
      id: 'nav-group-1',
      name: 'Allgemein',
      requiresAuthentication: false,
      children: [
        {
          id: 'nav-group-1-item-1',
          name: 'Startseite',
          path: '/',
          exact: true,
          icon: 'home',
          requiresAuthentication: false,
        },
        {
          id: 'nav-group-1-item-2',
          name: 'Einstellungen',
          path: '/settings',
          exact: true,
          icon: 'settings',
          requiresAuthentication: true,
        },
      ],
    },
    {
      id: 'nav-group-2',
      name: 'Account',
      requiresAuthentication: false,
      children: [
        {
          id: 'nav-group-2-item-1',
          name: 'Anmelden',
          path: '/auth/signin',
          exact: true,
          icon: 'login',
          requiresAuthentication: false,
          shouldHide: () => this.isAuthenticated,
        },
        {
          id: 'nav-group-2-item-2',
          name: 'Abmelden',
          path: '/signout',
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
          name: 'Profil',
          path: '/profile',
          exact: true,
          icon: 'person',
          requiresAuthentication: true,
        },
      ],
    },
    {
      id: 'nav-group-3',
      name: 'Mein Bereich',
      requiresAuthentication: true,
      children: [],
    }
  ];

  constructor(
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly media: MediaMatcher,
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
    console.log('SIGN OUT');
  }

  get isLowerThanXS(): boolean {
    return this.mobileQueries['lt-xs'].matches;
  }

  get isAuthenticated(): boolean {
    return true;
  }
}
