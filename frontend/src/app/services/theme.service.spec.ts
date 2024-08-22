import { TestBed } from '@angular/core/testing';

import { take, toArray } from 'rxjs';

import { ThemeMode, ThemeService } from '@Services/theme.service';
import { WindowProviderService } from '@Services/window-provider.service';

describe('Service: ThemeService', () => {
  let service: ThemeService;

  describe('constructor()', () => {
    let windowProvider: WindowProviderService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [WindowProviderService],
      });

      windowProvider = TestBed.inject(WindowProviderService);
      spyOn(windowProvider, 'getWindow').and.returnValue({
        matchMedia: jasmine.createSpy().and.returnValue({
          matches: true,
        }),
      } as any);
      service = TestBed.inject(ThemeService);
    });

    it('should create', () => {
      expect(service).toBeTruthy();
    });

    it('should have the dark mode initially changed from LIGHT to DARK', (done) => {
      service.modeStateChanged$.pipe(take(1)).subscribe((mode) => {
        expect(mode).toEqual(ThemeMode.DARK);

        done();
      });
    });
  });

  describe('toggle(): void', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [WindowProviderService]
      });

      service = TestBed.inject(ThemeService);
    });

    it('should create', () => {
      expect(service).toBeTruthy();
    });

    it('should toggle the theme mode (LIGHT -> DARK -> LIGHT)', (done) => {
      service.modeStateChanged$.pipe(take(3), toArray()).subscribe((mode) => {
        expect(mode.length).toBe(3);
        expect(mode[0]).toEqual(ThemeMode.LIGHT);
        expect(mode[1]).toEqual(ThemeMode.DARK);
        expect(mode[2]).toEqual(ThemeMode.LIGHT);

        done();
      });

      service.toggle();
      service.toggle();
    });
  });
});
