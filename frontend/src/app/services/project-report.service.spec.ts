import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { ProjectReportService } from './project-report.service';

describe('Service: ProjectReportService', () => {
  let service: ProjectReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
      ],
    });
    service = TestBed.inject(ProjectReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
