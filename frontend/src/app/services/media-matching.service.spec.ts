import { TestBed } from '@angular/core/testing';

import { MediaMatchingService } from './media-matching.service';

describe('MediaMatchingService', () => {
  let service: MediaMatchingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MediaMatchingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
