import { A11yModule } from '@angular/cdk/a11y';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

import { WindowProviderService } from '@Services/window-provider.service';

@Component({
  selector: 'hsel-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.scss',
  standalone: true,
  imports: [
    A11yModule,
    MatButtonModule,
  ],
})
export class PageNotFoundComponent {
  private window: Window;

  constructor(
    private readonly router: Router,
    private readonly windowProvider: WindowProviderService,
  ) {
    this.window = this.windowProvider.getWindow();
  }

  goOneBack(): void {
    this.window.history.back();
  }

  goToHomepage(): void {
    this.router.navigateByUrl('/');
  }
}
