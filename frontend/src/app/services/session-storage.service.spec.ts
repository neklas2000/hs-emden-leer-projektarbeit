import { TestBed } from '@angular/core/testing';

import { SessionStorageService } from '@Services/session-storage.service';

describe('Service: SessionStorageService', () => {
  let service: SessionStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionStorageService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
