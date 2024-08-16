import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { ProfileService } from '@Services/profile.service';

describe('Service: ProfileService', () => {
  let service: ProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });

    service = TestBed.inject(ProfileService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
