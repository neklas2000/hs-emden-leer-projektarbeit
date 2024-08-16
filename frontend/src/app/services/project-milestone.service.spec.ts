import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { ProjectMilestoneService } from '@Services/project-milestone.service';

describe('Service: ProjectMilestoneService', () => {
  let service: ProjectMilestoneService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });

    service = TestBed.inject(ProjectMilestoneService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
