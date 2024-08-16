import { A11yModule } from '@angular/cdk/a11y';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

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
  constructor(private readonly router: Router) {}

  goOneBack() {
    window.history.back();
  }

  goToHomepage(): void {
    this.router.navigateByUrl('/');
  }
}
