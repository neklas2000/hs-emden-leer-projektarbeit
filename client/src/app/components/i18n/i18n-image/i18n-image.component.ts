import { Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'hsel-i18n-image',
  imports: [TranslatePipe],
  templateUrl: './i18n-image.component.html',
  styleUrl: './i18n-image.component.scss',
  standalone: true,
})
export class I18nImageComponent {
  @Input() width!: string;
  @Input() height!: string;
  @Input() src!: string;
  @Input() i18nAlt!: string;
  @Input() imgClasses!: string;
}
