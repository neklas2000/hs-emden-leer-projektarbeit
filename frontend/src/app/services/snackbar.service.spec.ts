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

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('open(string, number?): void', () => {
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

  describe('showException(string, HttpException, number?): void', () => {
    it('should open a snackbar with an exception-code for 7 seconds', () => {
      const snackbarOpenFromComponentSpy = spyOn(snackbar, 'openFromComponent');
      const consoleErrorSpy = spyOn(console, 'error');

      service.showException('Hello World', { code: 'HSEL-400-001' } as any);

      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(snackbarOpenFromComponentSpy).toHaveBeenCalled();
      const args = snackbarOpenFromComponentSpy.calls.argsFor(0);
      expect(args.length).toBe(2);
      expect(args[1]).toEqual(jasmine.objectContaining({ duration: 7000 }));
      expect(args[1]).toEqual(jasmine.objectContaining({
        data: {
          type: 'error',
          label: 'Hello World (HSEL-400-001)',
        },
      }));
    });
  });

  describe('showInfo(string, number?): void', () => {
    it('should open a snackbar for 3 seconds', () => {
      const snackbarOpenFromComponentSpy = spyOn(snackbar, 'openFromComponent');

      service.showInfo('Hello World');

      expect(snackbarOpenFromComponentSpy).toHaveBeenCalled();
      const args = snackbarOpenFromComponentSpy.calls.argsFor(0);
      expect(args.length).toBe(2);
      expect(args[1]).toEqual(jasmine.objectContaining({ duration: 3000 }));
    });

    it('should open a snackbar for 7 seconds', () => {
      const snackbarOpenFromComponentSpy = spyOn(snackbar, 'openFromComponent');

      service.showInfo('Hello World', 7000);

      expect(snackbarOpenFromComponentSpy).toHaveBeenCalled();
      const args = snackbarOpenFromComponentSpy.calls.argsFor(0);
      expect(args.length).toBe(2);
      expect(args[1]).toEqual(jasmine.objectContaining({ duration: 7000 }));
      expect(args[1]).toEqual(jasmine.objectContaining({
        data: {
          type: 'info',
          label: 'Hello World',
        },
      }));
    });
  });

  describe('showWarning(string, number?): void', () => {
    it('should open a snackbar for 5 seconds', () => {
      const snackbarOpenFromComponentSpy = spyOn(snackbar, 'openFromComponent');

      service.showWarning('Hello World');

      expect(snackbarOpenFromComponentSpy).toHaveBeenCalled();
      const args = snackbarOpenFromComponentSpy.calls.argsFor(0);
      expect(args.length).toBe(2);
      expect(args[1]).toEqual(jasmine.objectContaining({ duration: 5000 }));
    });

    it('should open a snackbar for 8 seconds', () => {
      const snackbarOpenFromComponentSpy = spyOn(snackbar, 'openFromComponent');

      service.showWarning('Hello World', 8000);

      expect(snackbarOpenFromComponentSpy).toHaveBeenCalled();
      const args = snackbarOpenFromComponentSpy.calls.argsFor(0);
      expect(args.length).toBe(2);
      expect(args[1]).toEqual(jasmine.objectContaining({ duration: 8000 }));
      expect(args[1]).toEqual(jasmine.objectContaining({
        data: {
          type: 'warning',
          label: 'Hello World',
        },
      }));
    });
  });

  describe('showError(string, number?): void', () => {
    it('should open a snackbar for 7 seconds', () => {
      const snackbarOpenFromComponentSpy = spyOn(snackbar, 'openFromComponent');

      service.showError('Hello World');

      expect(snackbarOpenFromComponentSpy).toHaveBeenCalled();
      const args = snackbarOpenFromComponentSpy.calls.argsFor(0);
      expect(args.length).toBe(2);
      expect(args[1]).toEqual(jasmine.objectContaining({ duration: 7000 }));
    });

    it('should open a snackbar for 9 seconds', () => {
      const snackbarOpenFromComponentSpy = spyOn(snackbar, 'openFromComponent');

      service.showError('Hello World', 9000);

      expect(snackbarOpenFromComponentSpy).toHaveBeenCalled();
      const args = snackbarOpenFromComponentSpy.calls.argsFor(0);
      expect(args.length).toBe(2);
      expect(args[1]).toEqual(jasmine.objectContaining({ duration: 9000 }));
      expect(args[1]).toEqual(jasmine.objectContaining({
        data: {
          type: 'error',
          label: 'Hello World',
        },
      }));
    });
  });
});
