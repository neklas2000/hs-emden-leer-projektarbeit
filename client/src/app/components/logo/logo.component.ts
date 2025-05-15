import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

import { I18nModule } from '@i18n/i18n.module';
import { AppSettingsService, ColorMode } from '../../services/app-settings.service';

@Component({
  selector: 'hsel-logo',
  imports: [I18nModule],
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.scss',
  standalone: true,
})
export class LogoComponent implements OnInit, OnDestroy {
  colorMode: ColorMode = ColorMode.LIGHT;
  private displaySubscription!: Subscription;

  constructor(private readonly appSettings: AppSettingsService) {}

  ngOnInit(): void {
    this.displaySubscription = this.appSettings.display$.subscribe((displaySettings) => {
      this.colorMode = displaySettings.colorMode;
    });
  }

  ngOnDestroy(): void {
    if (this.displaySubscription) {
      this.displaySubscription.unsubscribe();
    }
  }
}
