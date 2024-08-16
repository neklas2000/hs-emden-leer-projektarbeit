import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';

import {
  ConfirmProjectMemberRemovalComponent
} from '@Dialogs/confirm-project-member-removal/confirm-project-member-removal.component';

describe('Component: ConfirmProjectMemberRemovalComponent', () => {
  let component: ConfirmProjectMemberRemovalComponent;
  let fixture: ComponentFixture<ConfirmProjectMemberRemovalComponent>;
  let dialogRefCloseSpy: jasmine.Spy<jasmine.Func>;

  beforeEach(async () => {
    dialogRefCloseSpy = jasmine.createSpy();

    await TestBed.configureTestingModule({
      imports: [ConfirmProjectMemberRemovalComponent],
      providers: [{
        provide: MatDialogRef,
        useValue: {
          close: dialogRefCloseSpy,
        },
      }],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmProjectMemberRemovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
