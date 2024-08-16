import { provideHttpClient } from '@angular/common/http';
import { EventEmitter } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { provideAnimations } from '@angular/platform-browser/animations';

import {
  Credentials,
  EditCredentialsComponent
} from '@Components/user/profile/edit-credentials/edit-credentials.component';
import { ProfileService } from '@Services/profile.service';
import { SnackbarService } from '@Services/snackbar.service';

describe('Component: EditCredentialsComponent', () => {
  let component: EditCredentialsComponent;
  let fixture: ComponentFixture<EditCredentialsComponent>;
  let backdropClickEvent: EventEmitter<{ preventDefault: () => void; }>;
  let spyDialogClose: jasmine.Spy<jasmine.Func>;

  beforeEach(async () => {
    backdropClickEvent = new EventEmitter();
    spyDialogClose = jasmine.createSpy();

    await TestBed.configureTestingModule({
      providers: [
        {
          provide: MatDialogRef,
          useValue: {
            backdropClick: () => backdropClickEvent,
            close: spyDialogClose,
          },
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            type: Credentials.EMAIL,
          },
        },
        FormBuilder,
        ProfileService,
        provideHttpClient(),
        SnackbarService,
        provideAnimations(),
      ],
      imports: [EditCredentialsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditCredentialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    backdropClickEvent.complete();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
