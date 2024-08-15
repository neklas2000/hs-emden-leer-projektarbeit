import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { of } from 'rxjs';

import { ProfileComponent } from '@Components/user/profile/profile.component';
import { AuthenticationService } from '@Services/authentication.service';
import { DialogService } from '@Services/dialog.service';
import { SnackbarService } from '@Services/snackbar.service';
import { UserService } from '@Services/user.service';

describe('Component: ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              profile: {},
            }),
          },
        },
        DialogService,
        SnackbarService,
        UserService,
        provideHttpClient(),
        AuthenticationService,
        Router,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
