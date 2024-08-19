import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';

import {
  ConfirmMilestoneEstimateDeletionComponent
} from '@Dialogs/confirm-milestone-estimate-deletion/confirm-milestone-estimate-deletion.component';

describe('Component: ConfirmMilestoneEstimateDeletionComponent', () => {
  let component: ConfirmMilestoneEstimateDeletionComponent;
  let fixture: ComponentFixture<ConfirmMilestoneEstimateDeletionComponent>;
  let dialogRefCloseSpy: jasmine.Spy<jasmine.Func>;

  beforeEach(async () => {
    dialogRefCloseSpy = jasmine.createSpy();

    await TestBed.configureTestingModule({
      imports: [ConfirmMilestoneEstimateDeletionComponent],
      providers: [{
        provide: MatDialogRef,
        useValue: {
          close: dialogRefCloseSpy,
        },
      }],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmMilestoneEstimateDeletionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
