import { ClassProvider } from '@angular/core';
import { TitleStrategy } from '@angular/router';

import { PageTitleStrategy } from '../strategies/page-title.strategy';

export function provideTitleStrategy(): ClassProvider {
  return {
    provide: TitleStrategy,
    useClass: PageTitleStrategy,
  };
}
