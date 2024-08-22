import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';

import { WindowProviderService } from '@Services/window-provider.service';

describe('Service: WindowProviderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{
        provide: DOCUMENT,
        useValue: document,
      }],
    });
  });

  it('should create with the documents defaultView', () => {
    const service = TestBed.inject(WindowProviderService);

    expect(service).toBeTruthy();
  });

  it('should create with the fallback window object', () => {
    spyOnProperty(document, 'defaultView', 'get').and.returnValue(null);
    TestBed.overrideProvider(DOCUMENT, { useValue: document });
    const service = TestBed.inject(WindowProviderService);

    expect(service).toBeTruthy();
  });

  describe('getWindow(): Window', () => {
    it('should return the window from the documents defaultView', () => {
      const service = TestBed.inject(WindowProviderService);

      expect(service.getWindow()).toBe(document.defaultView!);
    });
  });

  describe('getDocument(): Document', () => {
    it('should return the injected document', () => {
      const service = TestBed.inject(WindowProviderService);

      expect(service.getDocument()).toBe(document);
    });
  });
});
