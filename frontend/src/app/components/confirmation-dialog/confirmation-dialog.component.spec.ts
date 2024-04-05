import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ConfirmationDialogComponent } from './confirmation-dialog.component';

describe('Component: ConfirmationDialogComponent', () => {
  let component: ConfirmationDialogComponent;
  let fixture: ComponentFixture<ConfirmationDialogComponent>;
  let closeSpy: jasmine.Spy<jasmine.Func>;

  beforeEach(async () => {
    closeSpy = jasmine.createSpy();

    await TestBed.configureTestingModule({
      imports: [ConfirmationDialogComponent],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {
            close: closeSpy
          },
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            type: 'delete-milestone',
          },
        },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
