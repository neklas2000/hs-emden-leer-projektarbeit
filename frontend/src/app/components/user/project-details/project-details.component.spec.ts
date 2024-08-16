import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { of } from 'rxjs';

import {
  ProjectDetailsComponent
} from '@Components/user/project-details/project-details.component';
import { DialogService } from '@Services/dialog.service';
import { SnackbarService } from '@Services/snackbar.service';
import { ProjectMemberService } from '@Services/project-member.service';
import { ProjectMilestoneService } from '@Services/project-milestone.service';

describe('Component: ProjectDetailsComponent', () => {
  let component: ProjectDetailsComponent;
  let fixture: ComponentFixture<ProjectDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectDetailsComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              project: {
                name: 'Test',
                type: null,
                officialStart: '2024-01-01',
                officialEnd: null,
                reportInterval: 7,
                owner: {
                  email: 'max.mustermann@gmx.de',
                  phoneNumber: null,
                  academicTitle: null,
                  firstName: 'Max',
                  lastName: 'Mustermann',
                },
                members: [],
                reports: [],
                milestones: [],
              },
            }),
          },
        },
        DialogService,
        SnackbarService,
        ProjectMemberService,
        ProjectMilestoneService,
        provideHttpClient(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
