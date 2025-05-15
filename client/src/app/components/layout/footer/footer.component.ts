import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';

import { I18nTextComponent } from '@i18n/i18n-text/i18n-text.component';

@Component({
  selector: 'hsel-footer',
  imports: [MatToolbarModule, I18nTextComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  standalone: true,
})
export class FooterComponent {}
