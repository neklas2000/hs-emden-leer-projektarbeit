import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

export enum ThemeMode {
  LIGHT = 'LIGHT',
  DARK = 'DARK',
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private modeStateSubject = new BehaviorSubject(ThemeMode.LIGHT);
  modeStateChanged$: Observable<ThemeMode>;

  constructor(@Inject(DOCUMENT) private readonly document: Document) {
    this.modeStateChanged$ = this.modeStateSubject.asObservable();
    this.init();
  }

  private init(): void {
    const deviceMode = window.matchMedia('(prefers-color-scheme: dark)');

    if (deviceMode.matches) {
      this.activateDarkMode();
    }
  }

  private activateDarkMode(): void {
    this.document.body.classList.add('theme-alternate');
    this.modeStateSubject.next(ThemeMode.DARK);
  }

  toggle(): void {
    if (this.modeStateSubject.value === ThemeMode.LIGHT) {
      this.activateDarkMode();
    } else {
      this.activateLightMode();
    }
  }

  private activateLightMode(): void {
    this.document.body.classList.remove('theme-alternate');
    this.modeStateSubject.next(ThemeMode.LIGHT);
  }
}
