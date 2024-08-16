import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { AuthenticationService } from '@Services/authentication.service';
import { SessionStorageService } from '@Services/session-storage.service';

describe('Service: AuthenticationService', () => {
  let service: AuthenticationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        SessionStorageService,
      ]
    });

    service = TestBed.inject(AuthenticationService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
