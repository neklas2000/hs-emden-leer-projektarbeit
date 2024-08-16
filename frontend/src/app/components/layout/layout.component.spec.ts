import { MediaMatcher } from '@angular/cdk/layout';
import { provideHttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

import { LayoutComponent } from '@Components/layout/layout.component';
import { AuthenticationService } from '@Services/authentication.service';
import { SnackbarService } from '@Services/snackbar.service';
import { ThemeService } from '@Services/theme.service';

describe('Component: LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;

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
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
