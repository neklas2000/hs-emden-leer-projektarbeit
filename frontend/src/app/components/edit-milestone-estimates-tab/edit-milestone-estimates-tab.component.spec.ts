import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';

import {
  EditMilestoneEstimatesTabComponent
} from '@Components/edit-milestone-estimates-tab/edit-milestone-estimates-tab.component';
import { DialogService } from '@Services/dialog.service';
import { ProjectMilestoneService } from '@Services/project-milestone.service';
import { SnackbarService } from '@Services/snackbar.service';

describe('Component: EditMilestoneEstimatesTabComponent', () => {
  let component: EditMilestoneEstimatesTabComponent;
  let fixture: ComponentFixture<EditMilestoneEstimatesTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditMilestoneEstimatesTabComponent],
      providers: [
        FormBuilder,
        ProjectMilestoneService,
        provideHttpClient(),
        DialogService,
        SnackbarService,
        provideAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditMilestoneEstimatesTabComponent);
    component = fixture.componentInstance;
    component.milestone = {
      estimates: [],
      id: '1',
      name: 'Milestone A',
      project: null,
      milestoneReached: true,
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
