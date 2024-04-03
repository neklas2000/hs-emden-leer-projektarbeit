import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMilestoneEstimatesTabComponent } from './edit-milestone-estimates-tab.component';

describe('EditMilestoneEstimatesTabComponent', () => {
  let component: EditMilestoneEstimatesTabComponent;
  let fixture: ComponentFixture<EditMilestoneEstimatesTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditMilestoneEstimatesTabComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditMilestoneEstimatesTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
