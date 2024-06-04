import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';

import { of } from 'rxjs';

import { EditMilestoneEstimatesComponent } from './edit-milestone-estimates.component';
import { DateService } from '@Services/date.service';
import { ProjectMilestoneService } from '@Services/project-milestone.service';
import { SnackbarService } from '@Services/snackbar.service';

describe('Component: EditMilestoneEstimatesComponent', () => {
  let component: EditMilestoneEstimatesComponent;
  let fixture: ComponentFixture<EditMilestoneEstimatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditMilestoneEstimatesComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              milestones: [],
              project: null,
            })
          },
        },
        DateService,
        ProjectMilestoneService,
        provideHttpClient(),
        SnackbarService,
        MatDialog,
        provideAnimations(),
      ],
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
