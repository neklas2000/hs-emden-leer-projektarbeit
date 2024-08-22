import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { MediaMatching } from '@Services/media-matching.service';

class MediaMatcherStub {
  private mediaQueryBreakpointMap: { [key: string]: string; } = {
    '(min-width: 1920px)': 'gt-lg',
    '(max-width: 1919.99px)': 'lt-lg',
    '(min-width: 1280px)': 'gt-md',
    '(max-width: 1279.99px)': 'lt-md',
    '(min-width: 960px)': 'gt-sm',
    '(max-width: 959.99px)': 'lt-sm',
    '(min-width: 600px)': 'gt-xs',
    '(max-width: 599.99px)': 'lt-xs',
  };
  private listeners: {
    [key: string]: {
      matches: boolean;
      events: {
        [key: string]: (() => void)[];
      };
    }
  } = {};
  private removeListenerCalls = 0;

  matchMedia(query: string) {
    const breakpoint = this.mediaQueryBreakpointMap[query];
    this.listeners[breakpoint] = {
      matches: false,
      events: {},
    };

    const returnValue = {
      addEventListener: (ev: string, fn: () => void) => {
        const fns = this.listeners[breakpoint].events[ev] ?? [];
        fns.push(fn);

        this.listeners[breakpoint].events[ev] = fns;
      },
      removeEventListener: (ev: string, fn: () => void) => {
        this.removeListenerCalls++;

        if (this.listeners[breakpoint].events[ev]) {
          this.listeners[breakpoint].events[ev] = this.listeners[breakpoint].events[ev]
            .filter((_fn) => {
              return _fn != fn;
            });
        }
      },
    };

    Object.defineProperty(returnValue, 'matches', {
      get: () => {
        return this.listeners[breakpoint].matches;
      },
    });

    return returnValue;
  }

  emitBreakpoint(bp: string): void {
    for (const fn of (this.listeners[bp].events['changes'] ?? [])) {
      fn();
    }

    this.listeners[bp].matches = !this.listeners[bp].matches;
  };

  get calls() {
    return {
      removeEventListener: this.removeListenerCalls,
    };
  }
}

describe('Service: MediaMatching', () => {
  let service: MediaMatching;
  let detectChangesSpy: jasmine.Spy<() => void>;
  let media: MediaMatcherStub;

  beforeEach(() => {
    detectChangesSpy = jasmine.createSpy();

    TestBed.configureTestingModule({
      providers: [
        {
          provide: ChangeDetectorRef,
          useValue: {
            detectChanges: detectChangesSpy,
          },
        },
        {
          provide: MediaMatcher,
          useClass: MediaMatcherStub,
        },
      ],
    });

    media = TestBed.inject(MediaMatcher) as any;
    service = TestBed.inject(MediaMatching);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should detect changes', () => {
    service['mobileQueryListener']();

    expect(detectChangesSpy).toHaveBeenCalled();
  });

  describe('destroy(): void', () => {
    it('should remove all query listeners', () => {
      service.destroy();

      expect(media.calls.removeEventListener).toBe(8);
    });
  });

  describe('match(Breakpoint): boolean', () => {
    it('should report an error because the endpoint is not known', () => {
      spyOn(console, 'error');

      const matches = service.match('test' as any);

      expect(console.error).toHaveBeenCalledWith("The breakpoint 'test' is not defined");
      expect(matches).toBeFalsy();
    });

    it('should return a boolean literal, indicating if the breakpoint matches', () => {
      spyOn(console, 'error');
      media.emitBreakpoint('gt-lg');

      expect(service.match('gt-lg')).toBeTruthy();
      expect(console.error).not.toHaveBeenCalled();
    });
  });
});
