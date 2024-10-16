import { MediaMatcher } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Title } from '@angular/platform-browser';
import { RouterOutlet, RouterModule, Router, NavigationStart, EventType } from '@angular/router';

import { Subscription, take } from 'rxjs';

import { LogoComponent } from '@Components/logo/logo.component';
import { PageNotFoundComponent } from '@Components/page-not-found/page-not-found.component';
import { AuthenticationService } from '@Services/authentication.service';
import { MediaMatching } from '@Services/media-matching.service';
import { NotFoundService } from '@Services/not-found.service';
import { SnackbarMessage, SnackbarService } from '@Services/snackbar.service';
import { ThemeMode, ThemeService } from '@Services/theme.service';
import { Undefinable } from '@Types';

type NavigationItem = {
  id: number;
  to?: string;
  label: string;
  icon?: string;
  clickEvent?: () => void;
  shouldHide?: () => boolean;
};

type NavigationGroup = {
  id: number;
  label: string;
  items: NavigationItem[];
};

@Component({
  selector: 'hsel-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    LogoComponent,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    MatTooltipModule,
    MatProgressBarModule,
    RouterOutlet,
    RouterModule,
    PageNotFoundComponent,
  ],
})
export class LayoutComponent extends MediaMatching implements OnInit, OnDestroy {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  navigationSuccessful: boolean = true;
  isLoading: boolean = false;
  title: string = 'Meilensteintrendanalyse';
  subtitle: string = 'Hochschule Emden/Leer';
  navigationGroups: NavigationGroup[] = [
    {
      id: 1,
      label: 'Allgemeines',
      items: [
        {
          id: 1,
          label: 'Startseite',
          icon: 'home',
          to: '/',
        },
        {
          id: 2,
          label: 'Anmelden',
          icon: 'login',
          to: '/auth/login',
          shouldHide: () => {
            return this.isSignedIn();
          },
        },
        {
          id: 3,
          label: 'Abmelden',
          icon: 'logout',
          clickEvent: () => {
            this.logout();
          },
          shouldHide: () => {
            return !this.isSignedIn();
          },
        },
      ],
    },
    {
      id: 2,
      label: 'Mein Bereich',
      items: [
        {
          id: 1,
          label: 'Mein Profil',
          icon: 'person',
          to: '/profile'
        },
        {
          id: 2,
          label: 'Meine Projekte',
          icon: 'folder',
          to: '/projects',
        },
      ],
    },
  ];
  private themeMode!: ThemeMode;
  private themeSubscription: Undefinable<Subscription> = undefined;
  private eventsSubscription: Undefinable<Subscription> = undefined;
  private pageNotFoundSubscription: Undefinable<Subscription> = undefined;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private readonly theme: ThemeService,
    private readonly router: Router,
    private readonly authenticationService: AuthenticationService,
    private readonly snackbar: SnackbarService,
    private readonly notFoundService: NotFoundService,
    private readonly titleService: Title,
  ) {
    super(changeDetectorRef, media);
  }

  ngOnInit(): void {
    this.themeSubscription = this.theme.modeStateChanged$.subscribe((mode) => {
      this.themeMode = mode;
    });

    this.eventsSubscription = this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationStart) {
        this.navigationSuccessful = true;
        this.isLoading = true;
      } else if (
        [
          EventType.NavigationEnd,
          EventType.NavigationCancel,
          EventType.NavigationSkipped,
        ].includes(ev.type)
      ) {
        this.isLoading = false;
      }
    });

    this.pageNotFoundSubscription = this.notFoundService.pageNotFound$.subscribe((pageNotFound) => {
      this.navigationSuccessful = !pageNotFound;

      if (!this.navigationSuccessful) {
        this.titleService.setTitle(`404 - Page Not Found - ${this.titleService.getTitle()}`);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }

    if (this.eventsSubscription) {
      this.eventsSubscription.unsubscribe();
    }

    if (this.pageNotFoundSubscription) {
      this.pageNotFoundSubscription.unsubscribe();
    }

    this.destroy();
  }

  onNavigationClick(): void {
    if (this.match('lt-xs')) {
      this.sidenav.close();
    }
  }

  toggleThemeMode(): void {
    this.theme.toggle();
  }

  navigateTo(path: string): void {
    this.router.navigateByUrl(path);
  }

  get isLightMode(): boolean {
    return this.themeMode === ThemeMode.LIGHT;
  }

  logout(): void {
    this.authenticationService.logout().pipe(take(1)).subscribe((successful) => {
      if (successful) {
        this.snackbar.showInfo(SnackbarMessage.LOGOUT_SUCCEEDED);
        this.router.navigateByUrl('/auth/login');
      } else {
        this.snackbar.showWarning(SnackbarMessage.LOGOUT_NOT_POSSIBLE);
      }
    });
  }

  private isSignedIn(): boolean {
    return this.authenticationService.isAuthenticated();
  }

  getContentHeight(): string {
    const heights = ['100vh'];

    if (this.match('lt-xs')) {
      heights.push('var(--mat-toolbar-mobile-height)', 'var(--mat-toolbar-mobile-height)');
    } else {
      heights.push('var(--mat-toolbar-standard-height)', 'var(--mat-toolbar-standard-height)');
    }

    if (this.isLoading) {
      heights.push('max(var(--mdc-linear-progress-track-height), var(--mdc-linear-progress-active-indicator-height))');
    }

    return `calc(${heights.join(' - ')})`;
  }
}
