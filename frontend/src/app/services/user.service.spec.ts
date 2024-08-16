import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { UserService } from '@Services/user.service';

describe('Service: UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });

    service = TestBed.inject(UserService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
