import { A11yModule } from '@angular/cdk/a11y';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'hsel-page-not-found',
  standalone: true,
  imports: [
    MatButtonModule,
    A11yModule,
  ],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.scss'
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
