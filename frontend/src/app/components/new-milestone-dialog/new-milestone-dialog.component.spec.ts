import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMilestoneDialogComponent } from './new-milestone-dialog.component';

describe('NewMilestoneDialogComponent', () => {
  let component: NewMilestoneDialogComponent;
  let fixture: ComponentFixture<NewMilestoneDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewMilestoneDialogComponent]
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
