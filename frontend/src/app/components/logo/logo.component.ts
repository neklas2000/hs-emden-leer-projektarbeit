import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { Subscription } from 'rxjs';

import { ThemeMode, ThemeService } from '@Services/theme.service';
import { Undefinable } from '@Types';

@Component({
  selector: 'hsel-logo',
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.scss',
  standalone: true,
  imports: [CommonModule],
})
export class LogoComponent {
  @Input() imgClasses: string = '';

  themeMode!: ThemeMode;
  private themeSubscription: Undefinable<Subscription> = undefined;

  constructor(private readonly theme: ThemeService) {}

  ngOnInit(): void {
    this.themeSubscription = this.theme.modeStateChanged$.subscribe((mode) => {
      this.themeMode = mode;
    });
  }

  ngOnDestroy(): void {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }
}
