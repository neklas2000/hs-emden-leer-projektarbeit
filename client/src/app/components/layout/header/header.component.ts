import { MediaMatcher } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';

import { I18nModule } from '@i18n/i18n.module';
import { TitleService } from '../../../services/title.service';
import { TitleState } from '../../../utils/title-state';

type QueryListenerFn = (ev: MediaQueryListEvent) => void;
type Breakpoints = 'gt-md' | 'lt-md';
type MobileQueries<T_BREAKPOINTS extends string> = {
  [T_BREAKPOINT in T_BREAKPOINTS]: MediaQueryList;
};

@Component({
  selector: 'hsel-header',
  imports: [MatToolbarModule, I18nModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  standalone: true,
})
export class HeaderComponent implements OnInit, OnDestroy {
  private mobileQueryListener!: QueryListenerFn;
  private desktopQueryListener!: QueryListenerFn;
  private mobileQueries!: MobileQueries<Breakpoints>;
  private titleLength: string = 'long';
  title = new TitleState(`app.pages.home.title.${this.titleLength}`);
  subtitle = new TitleState(`app.pages.home.subtitle.${this.titleLength}`);

  constructor(
    private readonly media: MediaMatcher,
    private readonly titleService: TitleService,
  ) {}

  ngOnInit(): void {
    this.mobileQueryListener = (ev: MediaQueryListEvent) => {
      if (!ev.matches) return;

      this.titleLength = 'short';

      if (this.title.name) {
        let title = this.title.name;
        title = title.substring(0, title.lastIndexOf('.'));

        this.title.update(`${title}.${this.titleLength}`);
      }

      if (this.subtitle.name) {
        let subtitle = this.subtitle.name;
        subtitle = subtitle.substring(0, subtitle.lastIndexOf('.'));

        this.subtitle.update(`${subtitle}.${this.titleLength}`);
      }
    };
    this.desktopQueryListener = (ev: MediaQueryListEvent) => {
      if (!ev.matches) return;

      this.titleLength = 'long';

      if (this.title.name) {
        let title = this.title.name;
        title = title.substring(0, title.lastIndexOf('.'));

        this.title.update(`${title}.${this.titleLength}`);
      }

      if (this.subtitle.name) {
        let subtitle = this.subtitle.name;
        subtitle = subtitle.substring(0, subtitle.lastIndexOf('.'));

        this.subtitle.update(`${subtitle}.${this.titleLength}`);
      }
    };

    this.mobileQueries = {
      'gt-md': this.media.matchMedia('(min-width: 1280px)'),
      'lt-md': this.media.matchMedia('(max-width: 1279.99px)'),
    };

    this.mobileQueries['gt-md'].addEventListener(
      'change',
      this.desktopQueryListener,
    );
    this.mobileQueries['lt-md'].addEventListener(
      'change',
      this.mobileQueryListener,
    );

    this.titleService.title$.subscribe((titleData) => {
      if (!titleData) {
        this.title.reset();
        this.subtitle.reset();

        return;
      }

      let title = titleData.title;
      let subtitle = titleData.subtitle;

      title = title.substring(0, title.lastIndexOf('.'));
      this.title.update(`${title}.${this.titleLength}`);

      if (subtitle) {
        subtitle = subtitle.substring(0, subtitle.lastIndexOf('.'));
        subtitle = `${subtitle}.${this.titleLength}`;
      }

      this.subtitle.update(subtitle);
    });
  }

  ngOnDestroy(): void {
    this.mobileQueries['gt-md'].removeEventListener(
      'change',
      this.desktopQueryListener,
    );
    this.mobileQueries['lt-md'].removeEventListener(
      'change',
      this.mobileQueryListener,
    );
  }
}
