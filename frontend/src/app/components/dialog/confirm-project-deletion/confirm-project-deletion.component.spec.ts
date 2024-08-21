import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';

import {
  ConfirmProjectDeletionComponent
} from '@Dialogs/confirm-project-deletion/confirm-project-deletion.component';

describe('Component: ConfirmProjectDeletionComponent', () => {
  let component: ConfirmProjectDeletionComponent;
  let fixture: ComponentFixture<ConfirmProjectDeletionComponent>;
  let dialogRefCloseSpy: jasmine.Spy<jasmine.Func>;

  beforeEach(async () => {
    dialogRefCloseSpy = jasmine.createSpy();

    await TestBed.configureTestingModule({
      imports: [ConfirmProjectDeletionComponent],
      providers: [{
        provide: MatDialogRef,
        useValue: {
          close: dialogRefCloseSpy,
        },
      }],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmProjectDeletionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onCancel(): void', () => {
    it('should close the dialog', () => {
      component.onCancel();

      expect(dialogRefCloseSpy).toHaveBeenCalled();
    });
  });
});
