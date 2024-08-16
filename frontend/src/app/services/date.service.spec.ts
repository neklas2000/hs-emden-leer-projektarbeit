import { TestBed } from '@angular/core/testing';

import { DateService } from '@Services/date.service';

describe('Service: DateService', () => {
  let service: DateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DateService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
