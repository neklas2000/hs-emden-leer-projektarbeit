import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { provideLuxonDateAdapter } from '@angular/material-luxon-adapter';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

import { NewProjectComponent } from './new-project.component';
import { AuthenticationService } from '@Services/authentication.service';
import { DateService } from '@Services/date.service';
import { ProjectService } from '@Services/project.service';
import { SnackbarService } from '@Services/snackbar.service';

describe('Component: NewProjectComponent', () => {
  let component: NewProjectComponent;
  let fixture: ComponentFixture<NewProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        FormBuilder,
        DateService,
        MatDialog,
        SnackbarService,
        ProjectService,
        provideHttpClient(),
        provideRouter([]),
        AuthenticationService,
        provideLuxonDateAdapter(),
        provideAnimations(),
      ],
      imports: [NewProjectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NewProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
