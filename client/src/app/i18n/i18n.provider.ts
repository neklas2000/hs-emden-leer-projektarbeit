import { HttpClient } from '@angular/common/http';

import { provideTranslateService, TranslateLoader } from '@ngx-translate/core';

import { httpLoaderFactory } from './http-loader.factory';

export function provideI18N() {
  return provideTranslateService({
    defaultLanguage: 'en',
    useDefaultLang: true,
    loader: {
      provide: TranslateLoader,
      useFactory: httpLoaderFactory,
      deps: [HttpClient],
    },
  });
}
