import { MediaMatcher } from '@angular/cdk/layout';
import { provideHttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NavigationEnd, NavigationStart, provideRouter, Router, RouterEvent } from '@angular/router';

import { BehaviorSubject, of } from 'rxjs';

import { LayoutComponent } from '@Components/layout/layout.component';
import { AuthenticationService } from '@Services/authentication.service';
import { NotFoundService } from '@Services/not-found.service';
import { SnackbarMessage, SnackbarService } from '@Services/snackbar.service';
import { ThemeService } from '@Services/theme.service';

describe('Component: LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;
  let theme: ThemeService;
  let router: Router;
  let auth: AuthenticationService;
  let snackbar: SnackbarService;
  let title: Title;
  let notFound: NotFoundService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutComponent],
      providers: [
        ChangeDetectorRef,
        MediaMatcher,
        ThemeService,
        provideRouter([]),
        AuthenticationService,
        provideHttpClient(),
        SnackbarService,
        provideAnimations(),
        Title,
        NotFoundService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    theme = TestBed.inject(ThemeService);
    router = TestBed.inject(Router);
    auth = TestBed.inject(AuthenticationService);
    snackbar = TestBed.inject(SnackbarService);
    title = TestBed.inject(Title);
    notFound = TestBed.inject(NotFoundService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit(): void', () => {
    it('should change the title because a page was not found', () => {
      title.setTitle('Test Page');
      expect(title.getTitle()).toEqual('Test Page');

      notFound.emitNotFound();

      expect(title.getTitle()).toEqual('404 - Page Not Found - Test Page');
    });

    it('should toggle the isLoading flag', () => {
      const routerEvents$ = new BehaviorSubject<RouterEvent | null>(null);
      Object.defineProperty(router, 'events', {
        value: routerEvents$.asObservable(),
      });
      component.ngOnInit();

      expect(component.isLoading).toBeFalsy();

      routerEvents$.next(new NavigationStart(1, '/test'));

      expect(component.isLoading).toBeTruthy();

      routerEvents$.next(new NavigationEnd(1, '/test', ''));

      expect(component.isLoading).toBeFalsy();
    });
  });

  describe('onNavigationClick(): void', () => {
    it('should close the sidenav', () => {
      spyOn(component, 'match').and.returnValue(true);
      const sidenavCloseSpy = spyOn(component.sidenav, 'close');

      component.onNavigationClick();

      expect(sidenavCloseSpy).toHaveBeenCalled();
    });

    it('should not close the sidenav', () => {
      spyOn(component, 'match').and.returnValue(false);
      const sidenavCloseSpy = spyOn(component.sidenav, 'close');

      component.onNavigationClick();

      expect(sidenavCloseSpy).not.toHaveBeenCalled();
    });
  });

  describe('toggleThemeMode(): void', () => {
    it('should toggle the theme mode', () => {
      const themeToggleSpy = spyOn(theme, 'toggle');

      component.toggleThemeMode();

      expect(themeToggleSpy).toHaveBeenCalled();
    });
  });

  describe('navigateTo(string): void', () => {
    it('should navigate to a different url', () => {
      spyOn(router, 'navigateByUrl');

      component.navigateTo('/home');

      expect(router.navigateByUrl).toHaveBeenCalledWith('/home');
    });
  });

  describe('get isLightMode(): boolean', () => {
    it('should check if the light mode is activated', () => {
      expect(component.isLightMode).toBeTruthy();

      component.toggleThemeMode();

      expect(component.isLightMode).toBeFalsy();
    });
  });

  describe('logout(): void', () => {
    it('should be successful and redirect the user', () => {
      spyOn(auth, 'logout').and.returnValue(of(true));
      spyOn(snackbar, 'showInfo');
      spyOn(router, 'navigateByUrl');

      component.logout();

      expect(snackbar.showInfo).toHaveBeenCalledWith(SnackbarMessage.LOGOUT_SUCCEEDED);
      expect(router.navigateByUrl).toHaveBeenCalledWith('/auth/login');
    });

    it('should be unsuccessful and show a warning', () => {
      spyOn(auth, 'logout').and.returnValue(of(false));
      spyOn(snackbar, 'showWarning');
      spyOn(router, 'navigateByUrl');

      component.logout();

      expect(snackbar.showWarning).toHaveBeenCalledWith(SnackbarMessage.LOGOUT_NOT_POSSIBLE);
      expect(router.navigateByUrl).not.toHaveBeenCalled();
    });

    it('should get triggered by the menu item', () => {
      spyOn(component, 'logout');
      spyOn(auth, 'isAuthenticated').and.returnValue(true);
      fixture.detectChanges();

      const root = fixture.nativeElement as HTMLElement;
      const anchors = root.querySelectorAll<HTMLAnchorElement>('a[mat-list-item]');
      anchors.item(1).click();

      expect(anchors.length).toBe(4);
      expect(component.logout).toHaveBeenCalled();
    });
  });

  describe('getContentHeight(): string', () => {
    it('should return the content height for the standard view and when it is not loading', () => {
      spyOn(component, 'match').and.returnValue(false);
      component.isLoading = false;

      expect(component.getContentHeight()).toEqual([
        'calc(100vh',
        'var(--mat-toolbar-standard-height)',
        'var(--mat-toolbar-standard-height))',
      ].join(' - '));
    });

    it('should return the content height for the mobile view and when it is loading', () => {
      spyOn(component, 'match').and.returnValue(true);
      component.isLoading = true;

      expect(component.getContentHeight()).toEqual([
        'calc(100vh',
        'var(--mat-toolbar-mobile-height)',
        'var(--mat-toolbar-mobile-height)',
        'max(var(--mdc-linear-progress-track-height), var(--mdc-linear-progress-active-indicator-height)))',
      ].join(' - '));
    });
  });
});
