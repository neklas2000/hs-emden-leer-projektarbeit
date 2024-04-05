import { TestBed } from '@angular/core/testing';

import { MediaMatching } from './media-matching.service';

describe('Service: MediaMatching', () => {
  let service: MediaMatching;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MediaMatching);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
