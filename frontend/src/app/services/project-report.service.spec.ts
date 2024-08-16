import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { ProjectReportService } from '@Services/project-report.service';

describe('Service: ProjectReportService', () => {
  let service: ProjectReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });

    service = TestBed.inject(ProjectReportService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
