import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { provideLuxonDateAdapter } from '@angular/material-luxon-adapter';
import { provideAnimations } from '@angular/platform-browser/animations';

import {
  MilestoneEstimateFormFieldComponent
} from '@Components/milestone-estimate-form-field/milestone-estimate-form-field.component';

describe('Component: MilestoneEstimateFormFieldComponent', () => {
  let component: MilestoneEstimateFormFieldComponent;
  let fixture: ComponentFixture<MilestoneEstimateFormFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [FormBuilder, provideLuxonDateAdapter(), provideAnimations()],
      imports: [MilestoneEstimateFormFieldComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MilestoneEstimateFormFieldComponent);
    component = fixture.componentInstance;
    component.estimate = {
      id: '1',
      estimationDate: '2024-06-08',
      reportDate: '2024-06-01',
      milestone: null,
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
