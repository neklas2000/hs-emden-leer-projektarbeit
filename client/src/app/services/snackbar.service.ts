import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { InterpolationParameters, TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs';

import { AppSettingsService, InferSnackbarPosition } from './app-settings.service';
import { CustomSnackbarComponent, SnackbarData, ToastType } from '../components/custom-snackbar/custom-snackbar.component';

export enum SnackbarMessage {
  PREVIEW = 'snackbar.preview',
  LOGOUT_SUCCESS = 'snackbar.logout.success',
  LOGOUT_FAILURE = 'snackbar.logout.failure',
  LOGIN_SUCCESS = 'snackbar.login.success',
  LOGIN_FAILURE = 'snackbar.login.failure',
  REGISTER_SUCCESS = 'snackbar.register.success',
  REGISTER_FAILURE = 'snackbar.register.failure',
  CHANGES_SAVED = 'snackbar.changes.success',
  CHANGES_FAILURE_WARNING = 'snackbar.changes.failure.warning',
  CHANGES_FAILURE_ERROR = 'snackbar.changes.failure.error',
  SETTINGS_CHANGES_NO_ID = 'snackbar.settings.changes.no-id',
}

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  private position: InferSnackbarPosition<SnackbarPosition> = {
    vertical: 'top',
    horizontal: 'right',
  };

  constructor(
    private readonly appSettings: AppSettingsService,
    private readonly snackbar: MatSnackBar,
    private readonly translate: TranslateService,
  ) {
    this.appSettings.display$.subscribe({
      next: (displaySettings) => {
        this.position = displaySettings.snackbarPosition;
      },
    });
  }

  private open(message: string, type: ToastType = 'info', duration = 3_000): void {
    this.snackbar.openFromComponent<CustomSnackbarComponent, SnackbarData>(
      CustomSnackbarComponent,
      {
        verticalPosition: this.position.vertical,
        horizontalPosition: this.position.horizontal,
        data: {
          label: message,
          type,
        },
        duration,
        panelClass: `${type}-toast`,
      },
    );
  }

  info(i18nMessageKey: string, interpolateParams?: InterpolationParameters): void {
    this.translate.get(i18nMessageKey, interpolateParams)
      .pipe(take(1))
      .subscribe((translated) => {
        this.open(translated);
      });
  }

  warn(i18nMessageKey: string, interpolateParams?: InterpolationParameters): void {
    this.translate.get(i18nMessageKey, interpolateParams)
      .pipe(take(1))
      .subscribe((translated) => {
        this.open(translated, 'warning');
      });
  }

  error(i18nMessageKey: string, interpolateParams?: InterpolationParameters): void {
    this.translate.get(i18nMessageKey, interpolateParams)
      .pipe(take(1))
      .subscribe((translated) => {
        this.open(translated, 'error');
      });
  }

  errorWithCode(i18nMessageKey: string, exception: any, interpolateParams?: InterpolationParameters): void {
    this.translate.get(i18nMessageKey, {
      ...(exception?.code ? { exceptionCode: exception.code } : {}),
      ...(interpolateParams ?? {}),
    })
      .pipe(take(1))
      .subscribe((translated) => {
        this.open(translated, 'error');
      });
  }
}
