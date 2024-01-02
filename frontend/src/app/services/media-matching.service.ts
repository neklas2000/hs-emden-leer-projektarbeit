import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Injectable } from '@angular/core';

type Breakpoint = 'gt-lg' | 'lt-lg' | 'gt-md' | 'lt-md' | 'gt-sm' | 'lt-sm' | 'gt-xs' | 'lt-xs';
type MobileQueryListenerFn = () => void;

type MobileQueries = {
  [key: string]: MediaQueryList;
};

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

  destroy(): void {
    if (!this.mobileQueryListener) {
      return;
    }

    for (const breakpoint in this.mobileQueries) {
      this.mobileQueries[breakpoint].removeEventListener('change', this.mobileQueryListener);
    }
  }

  match(breakpoint: Breakpoint): boolean {
    if (!this.mobileQueries.hasOwnProperty(breakpoint)) {
      console.error(`The breakpoint '${breakpoint}' is not defined`);

      return false;
    }

    return this.mobileQueries[breakpoint].matches;
  }
}
