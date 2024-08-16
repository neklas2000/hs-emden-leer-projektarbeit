import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { ProjectService } from '@Services/project.service';

describe('Service: ProjectService', () => {
  let service: ProjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });

    service = TestBed.inject(ProjectService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
