import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MilestoneEstimateFormFieldComponent } from './milestone-estimate-form-field.component';

describe('MilestoneEstimateFormFieldComponent', () => {
  let component: MilestoneEstimateFormFieldComponent;
  let fixture: ComponentFixture<MilestoneEstimateFormFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MilestoneEstimateFormFieldComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MilestoneEstimateFormFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
