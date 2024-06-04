import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { MilestoneEstimateService } from './milestone-estimate.service';

describe('Service: MilestoneEstimateService', () => {
  let service: MilestoneEstimateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });

    service = TestBed.inject(MilestoneEstimateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
