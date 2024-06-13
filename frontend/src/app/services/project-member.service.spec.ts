import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { ProjectMemberService } from './project-member.service';

describe('Service: ProjectMemberService', () => {
  let service: ProjectMemberService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });
    service = TestBed.inject(ProjectMemberService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
