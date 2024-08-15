import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmProfileDeletionComponent } from './confirm-profile-deletion.component';
import { MatDialogRef } from '@angular/material/dialog';

describe('Component: ConfirmProfileDeletionComponent', () => {
  let component: ConfirmProfileDeletionComponent;
  let fixture: ComponentFixture<ConfirmProfileDeletionComponent>;
  let dialogRefCloseSpy: jasmine.Spy<jasmine.Func>;

  beforeEach(async () => {
    dialogRefCloseSpy = jasmine.createSpy();

    await TestBed.configureTestingModule({
      imports: [ConfirmProfileDeletionComponent],
      providers: [{
        provide: MatDialogRef,
        useValue: {
          close: dialogRefCloseSpy,
        },
      }],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmProfileDeletionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
