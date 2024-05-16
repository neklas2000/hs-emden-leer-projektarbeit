import { TestBed } from '@angular/core/testing';

import { AgChartService } from './ag-chart.service';

describe('AgChartService', () => {
  let service: AgChartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgChartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
