import { TestBed } from '@angular/core/testing';

import { NotFoundService } from '@Services/not-found.service';

describe('Service: NotFoundService', () => {
  let service: NotFoundService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotFoundService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
