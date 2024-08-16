import { TestBed } from '@angular/core/testing';

import { ThemeService } from '@Services/theme.service';

describe('Service: ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
