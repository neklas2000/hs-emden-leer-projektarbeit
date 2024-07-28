import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

/**
 * @description
 * This enumeration represents the two theme modes `LIGHT` and `DARK`.
 */
export enum ThemeMode {
  LIGHT = 'LIGHT',
  DARK = 'DARK',
}

/**
 * @description
 * This service can be used to observe the state of the theme mode. By default this service will
 * check if the user has a preference for the dark mode. If the user prefers the dark mode, the
 * active theme mode will be toggled. In order to observe theme mode changes this service offers
 * the property `modeStateChanged$` which is an observable.
 *
 * @usageNotes
 * ### Listen to theme mode changes
 * ```ts
 * \@Component({
 *    selector: 'hsel-hello-world',
 *    standalone: true,
 *    imports: [],
 *    templateUrl: './hello-world.component.html',
 *    styleUrl: './hello-world.component.scss'
 * })
 * class HelloWorldComponent implements OnInit {
 *    constructor(private readonly theme: ThemeService) {}
 *
 *    ngOnInit(): void {
 *      this.theme.modeStateChanged$.subscribe((themeMode) => {
 *        ... // act on the received theme mode
 *      });
 *    }
 * }
 * ```
 */
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

  /**
   * @description
   * This function toggles between both theme modes and changes the css class corresponding to the
   * mode.
   */
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
