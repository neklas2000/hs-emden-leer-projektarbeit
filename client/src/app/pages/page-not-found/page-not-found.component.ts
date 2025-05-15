import { A11yModule } from '@angular/cdk/a11y';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'hsel-page-not-found',
  imports: [
    A11yModule,
    MatButtonModule,
  ],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.scss',
  standalone: true,
})
export class PageNotFoundComponent {
  private readonly window: Window;

  constructor(
    private readonly router: Router,
    // private readonly windowProvider: WindowProviderService,
  ) {
    // this.window = this.windowProvider.getWindow();
    this.window = window;
  }

  goOneBack(): void {
    this.window.history.back();
  }

  goToHomepage(): void {
    this.router.navigateByUrl('/');
  }
}
