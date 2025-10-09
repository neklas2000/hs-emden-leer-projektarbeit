import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { ApplicationConfig, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { DefaultValueAccessor } from '@angular/forms';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideI18N } from './i18n/i18n.provider';
import { credentialsInterceptor } from './interceptors/credentials.interceptor';
import { jsonApiInterceptor } from './interceptors/json-api.interceptor';
import { appInitializerFactory } from './app-initializer-factory';
import { provideInterceptorsFromDi } from './providers/provide-interceptors-from-di.provider';
import { provideTitleStrategy } from './providers/provide-title-strategy.provider';

const originalRegisterOnChange = DefaultValueAccessor.prototype.registerOnChange;

DefaultValueAccessor.prototype.registerOnChange = function (fn) {
  return originalRegisterOnChange.call(this, value => {
    const trimmed = (typeof value === 'string') ? value.trim() : value;

    return fn(trimmed);
  });
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(
      withInterceptors([jsonApiInterceptor, credentialsInterceptor]),
      withInterceptorsFromDi(),
    ),
    provideInterceptorsFromDi(),
    provideI18N(),
    provideAppInitializer(appInitializerFactory),
    provideTitleStrategy(),
  ],
};
