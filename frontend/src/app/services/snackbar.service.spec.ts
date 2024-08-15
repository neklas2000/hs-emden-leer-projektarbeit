import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { provideAnimations } from '@angular/platform-browser/animations';

import { SnackbarService } from '@Services/snackbar.service';

describe('Service: SnackbarService', () => {
  let service: SnackbarService;
  let snackbar: MatSnackBar;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MatSnackBar, provideAnimations()]
    });

    service = TestBed.inject(SnackbarService);
    snackbar = TestBed.inject(MatSnackBar);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open a snackbar for 3 seconds', () => {
    const snackbarOpenFromComponentSpy = spyOn(snackbar, 'openFromComponent');

    service.open('Hello World');

    expect(snackbarOpenFromComponentSpy).toHaveBeenCalled();
    const args = snackbarOpenFromComponentSpy.calls.argsFor(0);
    expect(args.length).toBe(2);
    expect(args[1]).toEqual(jasmine.objectContaining({ duration: 3000 }));
  });

  it('should open a snackbar for 10 seconds', () => {
    const snackbarOpenFromComponentSpy = spyOn(snackbar, 'openFromComponent');

    service.open('Hello World', 10000);

    expect(snackbarOpenFromComponentSpy).toHaveBeenCalled();
    const args = snackbarOpenFromComponentSpy.calls.argsFor(0);
    expect(args.length).toBe(2);
    expect(args[1]).toEqual(jasmine.objectContaining({ duration: 10000 }));
  });
});
