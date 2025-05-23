import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';

import {
  ConfirmMilestoneDeletionComponent
} from '@Dialogs/confirm-milestone-deletion/confirm-milestone-deletion.component';

describe('Component: ConfirmMilestoneDeletionComponent', () => {
  let component: ConfirmMilestoneDeletionComponent;
  let fixture: ComponentFixture<ConfirmMilestoneDeletionComponent>;
  let dialogRefCloseSpy: jasmine.Spy<jasmine.Func>;

  beforeEach(async () => {
    dialogRefCloseSpy = jasmine.createSpy();

    await TestBed.configureTestingModule({
      imports: [ConfirmMilestoneDeletionComponent],
      providers: [{
        provide: MatDialogRef,
        useValue: {
          close: dialogRefCloseSpy,
        },
      }],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmMilestoneDeletionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onCancel(): void', () => {
    it('should close the dialog', () => {
      component.onCancel();

      expect(dialogRefCloseSpy).toHaveBeenCalledWith(false);
    });
  });
});
