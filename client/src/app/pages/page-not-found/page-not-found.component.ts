import { A11yModule } from '@angular/cdk/a11y';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { I18nModule } from '@i18n/i18n.module';

@Component({
  selector: 'hsel-page-not-found',
  imports: [
    A11yModule,
    I18nModule,
  ],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.scss',
  standalone: true,
})
export class PageNotFoundComponent {
  private readonly window: Window;

  constructor(private readonly router: Router) {
    this.window = window;
  }

  goOneBack(): void {
    this.window.history.back();
  }

  goToHomepage(): void {
    this.router.navigateByUrl('/');
  }
}
