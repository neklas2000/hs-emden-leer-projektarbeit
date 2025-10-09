import { NgModule } from '@angular/core';

import { TranslatePipe } from '@ngx-translate/core';

import { I18nButtonComponent } from './i18n-button/i18n-button.component';
import { I18nHeadlineComponent } from './i18n-headline/i18n-headline.component';
import { I18nImageComponent } from './i18n-image/i18n-image.component';
import { I18nTextComponent } from './i18n-text/i18n-text.component';

const COMPONENTS = [
  I18nButtonComponent,
  I18nHeadlineComponent,
  I18nImageComponent,
  I18nTextComponent,
];

@NgModule({
  imports: [...COMPONENTS, TranslatePipe],
  exports: [...COMPONENTS, TranslatePipe],
})
export class I18nModule {}
