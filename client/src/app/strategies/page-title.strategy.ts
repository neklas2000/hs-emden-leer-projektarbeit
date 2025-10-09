import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PageTitleStrategy extends TitleStrategy {
  private lastRouterState: RouterStateSnapshot | null = null;

  constructor(
    private readonly translation: TranslateService,
    private readonly title: Title,
  ) {
    super();

    this.translation.onLangChange.asObservable().subscribe({
      next: () => {
        if (this.lastRouterState) {
          const title = this.buildTitle(this.lastRouterState);
          this.setTitle(title);
        }
      },
    });
  }

  override updateTitle(routerState: RouterStateSnapshot) {
    this.lastRouterState = routerState;
    const title = this.buildTitle(routerState);
    this.setTitle(title);
  }

  private setTitle(title: string | undefined): void {
    if (title) {
      this.translation.get(title).pipe(take(1)).subscribe({
        next: (translatedTitle) => {
          this.title.setTitle(translatedTitle);
        },
      });
    }
  }
}
