import { TestBed } from '@angular/core/testing';

import { AppCollectionService } from './app-collection.service';

describe('AppCollectionService', () => {
  let service: AppCollectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppCollectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
