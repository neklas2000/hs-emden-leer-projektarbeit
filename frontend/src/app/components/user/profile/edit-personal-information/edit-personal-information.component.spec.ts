import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';

import {
  EditPersonalInformationComponent
} from '@Components/user/profile/edit-personal-information/edit-personal-information.component';
import { ProfileService } from '@Services/profile.service';
import { SnackbarService } from '@Services/snackbar.service';

describe('Component: EditPersonalInformationComponent', () => {
  let component: EditPersonalInformationComponent;
  let fixture: ComponentFixture<EditPersonalInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        FormBuilder,
        ProfileService,
        provideHttpClient(),
        SnackbarService,
        provideAnimations(),
      ],
      imports: [EditPersonalInformationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditPersonalInformationComponent);
    component = fixture.componentInstance;
    component.profile = {};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
