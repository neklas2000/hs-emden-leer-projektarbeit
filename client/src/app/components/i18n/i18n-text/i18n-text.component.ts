import { Component, Input } from '@angular/core';

import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'hsel-i18n-text',
  imports: [TranslatePipe],
  templateUrl: './i18n-text.component.html',
  styleUrl: './i18n-text.component.scss',
  standalone: true,
})
export class I18nTextComponent {
  @Input() i18nKey!: string;
}
