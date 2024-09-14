import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationConfig, SecurityContext } from '@angular/core';
import { DefaultValueAccessor } from '@angular/forms';
import { provideLuxonDateAdapter } from '@angular/material-luxon-adapter';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { MARKED_OPTIONS, MarkedRenderer, provideMarkdown } from 'ngx-markdown';

import { routes } from './app.routes';
import { appInitializerFactory } from './app-initializer-factory';
import { CHECKED_CHECKBOX, UNCHECKED_CHECKBOX } from '../constants';
import { AuthenticationInterceptor } from '@Interceptors/authentication.interceptor';
import { credentialsInterceptor } from '@Interceptors/credentials.interceptor';
import { AuthenticationService } from '@Services/authentication.service';

const originalRegisterOnChange = DefaultValueAccessor.prototype.registerOnChange;

DefaultValueAccessor.prototype.registerOnChange = function (fn) {
  return originalRegisterOnChange.call(this, value => {
    const trimmed = (typeof value === 'string') ? value.trim() : value;

    return fn(trimmed);
  });
};

/**
 * @description
 * This configuration provides required modules globally so they are accessible throughout the
 * entire application.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideAnimations(),
    provideMarkdown({
      sanitize: SecurityContext.NONE,
      markedOptions: {
        provide: MARKED_OPTIONS,
        useFactory: () => {
          const renderer = new MarkedRenderer();

          renderer.checkbox = (checked: boolean): string => {
            if (checked) {
              return `<img width="16px" src="${CHECKED_CHECKBOX}" alt="checked checkbox">`;
            }

            return `<img width="16px" src="${UNCHECKED_CHECKBOX}" alt="unchecked checkbox">`;
          };

          const _listitem = renderer.listitem.bind(renderer);
          renderer.listitem = (text: string, task: boolean, checked: boolean): string => {
            if (!task) return _listitem(text, task, checked);

            return `<div style="display: flex; flex-direction: row; align-items: center; column-gap: 8px;"><li>${text}</li></div>`;
          };

          return {
            renderer,
            gfm: true,
            breaks: false,
            pedantic: false,
          };
        },
      },
    }),
    provideHttpClient(withInterceptorsFromDi(), withInterceptors([credentialsInterceptor])),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationInterceptor,
      multi: true,
    },
    provideLuxonDateAdapter({
      parse: {
        dateInput: ['dd.MM.yyyy', 'yyyy-MM-dd'],
      },
      display: {
        dateInput: 'dd.MM.yyyy',
        monthYearLabel: 'dd.MM.yyyy',
        dateA11yLabel: 'dd.MM.yyyy',
        monthYearA11yLabel: 'dd.MM.yyyy',
      },
    }),
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFactory,
      deps: [AuthenticationService],
      multi: true,
    },
  ]
};
