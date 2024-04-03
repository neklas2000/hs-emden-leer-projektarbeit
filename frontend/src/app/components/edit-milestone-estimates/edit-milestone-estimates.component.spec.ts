import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMilestoneEstimatesComponent } from './edit-milestone-estimates.component';

describe('EditMilestoneEstimatesComponent', () => {
  let component: EditMilestoneEstimatesComponent;
  let fixture: ComponentFixture<EditMilestoneEstimatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditMilestoneEstimatesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditMilestoneEstimatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
