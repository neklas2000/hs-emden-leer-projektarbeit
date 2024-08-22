import { TestBed } from '@angular/core/testing';

import { UtilityProviderService } from './utility-provider.service';

describe('Service: UtilityProviderService', () => {
  let service: UtilityProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtilityProviderService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
