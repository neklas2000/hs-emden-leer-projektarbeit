import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { I18nTextComponent } from '../i18n-text/i18n-text.component';

type ButtonType = 'stroked' | 'raised' | 'flat' | 'icon' | 'default';
type ButtonColor = 'primary' | 'accent';

@Component({
  selector: 'hsel-i18n-button',
  imports: [I18nTextComponent, MatButtonModule, MatIconModule],
  templateUrl: './i18n-button.component.html',
  styleUrl: './i18n-button.component.scss',
  standalone: true,
})
export class I18nButtonComponent {
  @Output() onClick = new EventEmitter<MouseEvent>();
  @Input() i18nText!: string;
  @Input() type!: ButtonType;
  @Input() color!: ButtonColor;
  @Input() iconName?: string;
  @Input() disabled: boolean = false;
}
