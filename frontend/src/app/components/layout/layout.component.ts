import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';

import { Subscription, take } from 'rxjs';

import { MediaMatching } from '@Services/media-matching.service';
import { ThemeMode, ThemeService } from '@Services/theme.service';
import { AuthenticationService } from '@Services/authentication.service';
import { Undefinable } from '@Types';
import { SnackbarService } from '@Services/snackbar.service';
import { LogoComponent } from '@Components/logo/logo.component';

type NavigationItem = {
  id: number;
  to?: string;
  label: string;
  icon?: string;
  clickEvent?: () => void;
};

type NavigationGroup = {
  id: number;
  label: string;
  items: NavigationItem[];
};

@Component({
  selector: 'hsel-layout',
  standalone: true,
  imports: [
    LogoComponent,
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatListModule,
    RouterModule,
    MatDividerModule,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent extends MediaMatching implements OnInit, OnDestroy {
  @ViewChild('sidenav') sidenav!: MatSidenav;

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
        },
        {
          id: 3,
          label: 'Abmelden',
          icon: 'logout',
          clickEvent: () => {
            this.logout();
          }
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

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private readonly theme: ThemeService,
    private readonly router: Router,
    private readonly authenticationService: AuthenticationService,
    private readonly snackbar: SnackbarService,
  ) {
    super(changeDetectorRef, media);
  }

  ngOnInit(): void {
    this.themeSubscription = this.theme.modeStateChanged$.subscribe((mode) => {
      this.themeMode = mode;
    });
  }

  ngOnDestroy(): void {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
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
        this.router.navigateByUrl('/auth/login');
      } else {
        this.snackbar.open('Sie konnten nicht abgemeldet werden');
      }
    });
  }
}
