import { TestBed } from '@angular/core/testing';

import { MilestoneEstimateService } from './milestone-estimate.service';

describe('MilestoneEstimateService', () => {
  let service: MilestoneEstimateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MilestoneEstimateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
