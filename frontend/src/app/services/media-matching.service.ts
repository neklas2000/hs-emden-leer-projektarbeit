import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Injectable } from '@angular/core';

/**
 * @description
 * This type represents the available device breakpoints.
 */
type Breakpoint = 'gt-lg' | 'lt-lg' | 'gt-md' | 'lt-md' | 'gt-sm' | 'lt-sm' | 'gt-xs' | 'lt-xs';
type MobileQueryListenerFn = () => void;

/**
 * @description
 * This type represents a map of mobile queries consisting of all breakpoints and their query lists
 * respectively.
 */
type MobileQueries = {
  [key: string]: MediaQueryList;
};

/**
 * @description
 * This class can be used to provide a component with an javascript implementation of media device
 * matching. It can be useful if the media matching from css doesn't fullfil it's needs and the
 * dynamic responsive behaviour has to be achieved through different means.
 */
@Injectable({
  providedIn: 'root'
})
export class MediaMatching {
  private mobileQueryListener!: MobileQueryListenerFn;
  private mobileQueries: MobileQueries = { };

  constructor(
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly media: MediaMatcher,
  ) {
    this.setupMobileQueries();
  }

  private setupMobileQueries(): void {
    this.mobileQueryListener = () => this.changeDetectorRef.detectChanges();

    this.mobileQueries = {
      'gt-lg': this.media.matchMedia('(min-width: 1920px)'),
      'lt-lg': this.media.matchMedia('(max-width: 1919.99px)'),
      'gt-md': this.media.matchMedia('(min-width: 1280px)'),
      'lt-md': this.media.matchMedia('(max-width: 1279.99px)'),
      'gt-sm': this.media.matchMedia('(min-width: 960px)'),
      'lt-sm': this.media.matchMedia('(max-width: 959.99px)'),
      'gt-xs': this.media.matchMedia('(min-width: 600px)'),
      'lt-xs': this.media.matchMedia('(max-width: 599.99px)')
    };

    for (const breakpoint in this.mobileQueries) {
      this.mobileQueries[breakpoint].addEventListener('change', this.mobileQueryListener);
    }
  }

  /**
   * @description
   * This function removes every internal registered listeners. This should be called inside a
   * component within the lifycycle hook `OnDestroy`.
   */
  destroy(): void {
    if (!this.mobileQueryListener) {
      return;
    }

    for (const breakpoint in this.mobileQueries) {
      this.mobileQueries[breakpoint].removeEventListener('change', this.mobileQueryListener);
    }
  }

  /**
   * @description
   * This function first checks if the provided breakpoint is defined within the map of breakpoints.
   * If it is not defined an error will be printed in the console and the function returns `false`.
   * Otherwise it returns the boolean value, representing if the breakpoint matches the width of the
   * users device.
   *
   * @param breakpoint The breakpoint to check for.
   * @returns `true`, if the breakpoint is defined and it matches, otherwise `false`.
   */
  match(breakpoint: Breakpoint): boolean {
    if (!this.mobileQueries.hasOwnProperty(breakpoint)) {
      console.error(`The breakpoint '${breakpoint}' is not defined`);

      return false;
    }

    return this.mobileQueries[breakpoint].matches;
  }
}
