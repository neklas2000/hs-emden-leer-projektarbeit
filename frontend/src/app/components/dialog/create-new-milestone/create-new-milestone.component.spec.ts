import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { provideAnimations } from '@angular/platform-browser/animations';

import { CreateNewMilestoneComponent } from '@Dialogs/create-new-milestone/create-new-milestone.component';

describe('Component: CreateNewMilestoneComponent', () => {
  let component: CreateNewMilestoneComponent;
  let fixture: ComponentFixture<CreateNewMilestoneComponent>;
  let dialogRefCloseSpy: jasmine.Spy<jasmine.Func>;

  beforeEach(async () => {
    dialogRefCloseSpy = jasmine.createSpy();

    await TestBed.configureTestingModule({
      imports: [CreateNewMilestoneComponent],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {
            close: dialogRefCloseSpy,
          },
        },
        provideAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateNewMilestoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onCancelClick(): void', () => {
    it('should close the dialog', () => {
      component.onCancelClick();

      expect(dialogRefCloseSpy).toHaveBeenCalled();
    });
  });

  describe('closeWithData(): void', () => {
    it('should close the dialog with data', () => {
      component.form.patchValue({
        name: 'New Milestone',
      });

      component.closeWithData();

      expect(dialogRefCloseSpy).toHaveBeenCalledWith({
        name: 'New Milestone'
      });
    });
  });
});
