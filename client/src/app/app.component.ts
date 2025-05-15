import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { AppSettingsService } from './services/app-settings.service';

@Component({
  selector: 'hsel-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'client';
  private languageSubscription!: Subscription;

  constructor(
    private readonly appSettings: AppSettingsService,
    private readonly i18n: TranslateService,
  ) {}

  ngOnInit(): void {
    this.languageSubscription = this.appSettings.language$.subscribe({
      next: (lang) => {
        this.i18n.use(lang);
      },
    });
  }

  ngOnDestroy(): void {
    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }
  }
}
