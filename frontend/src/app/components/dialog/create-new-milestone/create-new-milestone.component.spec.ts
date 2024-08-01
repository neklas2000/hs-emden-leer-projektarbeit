import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { provideAnimations } from '@angular/platform-browser/animations';

import { CreateNewMilestoneComponent } from './create-new-milestone.component';

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
});
