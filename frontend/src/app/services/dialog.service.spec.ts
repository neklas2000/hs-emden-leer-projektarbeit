import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';

import { DialogService } from '@Services/dialog.service';

describe('Service: DialogService', () => {
  let service: DialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MatDialog],
    });

    service = TestBed.inject(DialogService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
