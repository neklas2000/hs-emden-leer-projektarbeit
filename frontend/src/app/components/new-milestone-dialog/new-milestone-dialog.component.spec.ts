import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { provideAnimations } from '@angular/platform-browser/animations';

import { NewMilestoneDialogComponent } from './new-milestone-dialog.component';

describe('Component: NewMilestoneDialogComponent', () => {
  let component: NewMilestoneDialogComponent;
  let fixture: ComponentFixture<NewMilestoneDialogComponent>;
  let closeSpy: jasmine.Spy<jasmine.Func>;

  beforeEach(async () => {
    closeSpy = jasmine.createSpy();

    await TestBed.configureTestingModule({
      imports: [NewMilestoneDialogComponent],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {
            close: closeSpy,
          },
        },
        provideAnimations(),
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewMilestoneDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
