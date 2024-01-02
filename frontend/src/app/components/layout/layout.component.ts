import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterOutlet, RouterModule, Router, ActivatedRoute } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';

import { MediaMatching } from '../../services/media-matching.service';
import { ThemeMode, ThemeService } from '../../services/theme.service';

type NavigationItem = {
  id: number;
  to: string;
  label: string;
  icon?: string;
};

type NavigationGroup = {
  id: number;
  label: string;
  items: NavigationItem[];
};

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
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
export class LayoutComponent extends MediaMatching implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  @ViewChild('svgContainer') svgContainer!: ElementRef<HTMLDivElement>;

  title: string = 'Meilensteintrendanalyse - Hochschule Emden/Leer';
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
          to: '/auth/logout',
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
  private currentThemeMode!: ThemeMode;
  private logo!: string;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private readonly theme: ThemeService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
  ) {
    super(changeDetectorRef, media);

    this.theme.modeStateChanged$.subscribe((mode) => {
      this.currentThemeMode = mode;
    });
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ logo }) => {
      this.logo = logo;
    });
  }

  ngAfterViewInit(): void {
    this.svgContainer.nativeElement.innerHTML = this.logo;
  }

  ngOnDestroy(): void {
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
    return this.currentThemeMode === ThemeMode.LIGHT;
  }
}
