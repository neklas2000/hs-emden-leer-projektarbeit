import { Component, Input } from '@angular/core';

import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'hsel-i18n-headline',
  imports: [TranslatePipe],
  templateUrl: './i18n-headline.component.html',
  styleUrl: './i18n-headline.component.scss',
  standalone: true,
})
export class I18nHeadlineComponent {
  @Input() i18nKey!: string;
  @Input() level: number = 1;
}
