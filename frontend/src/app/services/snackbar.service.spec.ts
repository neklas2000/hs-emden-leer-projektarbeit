import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';

import { SnackbarService } from './snackbar.service';

describe('Service: SnackbarService', () => {
  let service: SnackbarService;
  let snackbar: MatSnackBar;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MatSnackBar]
    });

    service = TestBed.inject(SnackbarService);
    snackbar = TestBed.inject(MatSnackBar);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open a snackbar for 3 seconds', () => {
    const snackbarOpenSpy = spyOn(snackbar, 'open');

    service.open('Hello World');

    expect(snackbarOpenSpy).toHaveBeenCalledWith(
      'Hello World',
      undefined,
      {
        duration: 3000,
        direction: 'ltr',
        horizontalPosition: 'left',
        verticalPosition: 'bottom',
        announcementMessage: 'Hello World',
      },
    );
  });

  it('should open a snackbar for 10 seconds', () => {
    const snackbarOpenSpy = spyOn(snackbar, 'open');

    service.open('Hello World', 10000);

    expect(snackbarOpenSpy).toHaveBeenCalledWith(
      'Hello World',
      undefined,
      {
        duration: 10000,
        direction: 'ltr',
        horizontalPosition: 'left',
        verticalPosition: 'bottom',
        announcementMessage: 'Hello World',
      },
    );
  });
});
