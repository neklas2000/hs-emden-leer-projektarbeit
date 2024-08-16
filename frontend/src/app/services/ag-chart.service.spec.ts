import { TestBed } from '@angular/core/testing';

import { AgChartService } from '@Services/ag-chart.service';

describe('Service: AgChartService', () => {
  let service: AgChartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgChartService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
