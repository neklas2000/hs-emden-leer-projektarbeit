import { Injectable } from '@angular/core';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

import { catchError, map, Observable, of, switchMap, take } from 'rxjs';

import { AuthenticationService } from './authentication.service';
import { BehaviorSubject } from '../common/behavior-subject';
import { JsonApiConnector } from './json-api-connector';
import { ToastType } from '../components/custom-snackbar/custom-snackbar.component';

export enum AppLanguage {
	GERMAN = 'de',
	ENGLISH = 'en',
}

export enum ColorMode {
	LIGHT = 'LIGHT',
	DARK = 'DARK',
}

export enum PrimaryActionPosition {
	BOTTOM_RIGHT = 'bottom-right',
	TOOLBAR_BOTTOM_RIGHT = 'toolbar-bottom-right',
}

export enum SnackbarPosition {
	TOP_LEFT = 'top-left',
	TOP_CENTER = 'top-center',
	TOP_RIGHT = 'top-right',
	BOTTOM_LEFT = 'bottom-left',
	BOTTOM_CENTER = 'bottom-center',
	BOTTOM_RIGHT = 'bottom-right',
}

export type InferSnackbarPosition<T> = T extends `${infer T_V extends MatSnackBarVerticalPosition}-${infer T_H extends MatSnackBarHorizontalPosition}` ? {
  vertical: T_V;
  horizontal: T_H;
} : never;

export type DisplaySettings = {
  colorMode: ColorMode;
  dateFormat: string;
  timeFormat: string;
  primaryActionPosition: PrimaryActionPosition;
  snackbarPosition: InferSnackbarPosition<SnackbarPosition>;
};

export type NotificationSettings = {
  projectInvitation: boolean;
  projectChanges: boolean;
  newProjectReport: boolean;
  newProjectReportAttachPdf: boolean;
  latestProjectReportChanges: boolean;
  latestProjectReportChangesAttachPdf: boolean;
};

export type UpdateInfo = {
  successful: boolean;
  toastMessage: string;
  toastType: ToastType;
  error: any;
  exception: any;
};

@Injectable({
  providedIn: 'root'
})
export class AppSettingsService extends JsonApiConnector<Entities.AppSettings> {
  private id!: UUID;
  private readonly language: BehaviorSubject<AppLanguage>;
  private readonly display: BehaviorSubject<DisplaySettings>;
  private readonly notifications: BehaviorSubject<NotificationSettings>;
  readonly language$: Observable<AppLanguage>;
  readonly display$: Observable<DisplaySettings>;
  readonly notifications$: Observable<NotificationSettings>;

  constructor(private readonly auth: AuthenticationService) {
    super('app-settings');

    this.language = new BehaviorSubject<AppLanguage>(AppLanguage.ENGLISH);
    this.language$ = this.language.asObservable();
    this.display = new BehaviorSubject<DisplaySettings>({
      colorMode: ColorMode.LIGHT,
      dateFormat: 'dd.MM.YYYY',
      timeFormat: 'HH:mm',
      primaryActionPosition: PrimaryActionPosition.BOTTOM_RIGHT,
      snackbarPosition: {
        vertical: 'top',
        horizontal: 'right',
      },
    });
    this.display$ = this.display.asObservable();
    this.notifications = new BehaviorSubject<NotificationSettings>({
      projectInvitation: true,
      projectChanges: true,
      newProjectReport: true,
      newProjectReportAttachPdf: true,
      latestProjectReportChanges: true,
      latestProjectReportChangesAttachPdf: true,
    });
    this.notifications$ = this.notifications.asObservable();

    this.auth.loggedOut$.subscribe({
      next: (isLoggedOut) => {
        if (isLoggedOut) {
          this.language.reset();
          this.display.reset();
          this.notifications.reset();
        }
      },
    });
  }

  loadInitialSettings(userId: UUID): void {
    this.read<Omit<Entities.AppSettings, 'createdAt' | 'updatedAt'>[]>({
      filters: { 'user.id': userId },
      sparseFieldsets: {
        appsettings: [
          'id',
          'language',
          'colorMode',
          'dateFormat',
          'timeFormat',
          'primaryActionPosition',
          'snackbarPosition',
          'projectInvitation',
          'projectChanges',
          'newProjectReport',
          'newProjectReportAttachPdf',
          'latestProjectReportChanges',
          'latestProjectReportChangesAttachPdf',
        ],
      },
    }).pipe(take(1)).subscribe({
      next: ([appSettings]) => {
        this.id = appSettings.id;

        this.language.next(appSettings.language);
        this.display.next({
          colorMode: appSettings.colorMode,
          dateFormat: appSettings.dateFormat,
          timeFormat: appSettings.timeFormat,
          primaryActionPosition: appSettings.primaryActionPosition,
          snackbarPosition: this.inferSnackbarPosition(appSettings.snackbarPosition),
        });
        this.notifications.next({
          projectInvitation: appSettings.projectInvitation,
          projectChanges: appSettings.projectChanges,
          newProjectReport: appSettings.newProjectReport,
          newProjectReportAttachPdf: appSettings.newProjectReportAttachPdf,
          latestProjectReportChanges: appSettings.latestProjectReportChanges,
          latestProjectReportChangesAttachPdf: appSettings.latestProjectReportChangesAttachPdf,
        });
      },
    });
  }

  updateLanguage(language: AppLanguage): Observable<UpdateInfo> {
    return this.updateSettings({ language }).pipe(map((updateInfo) => {
      if (updateInfo.successful) {
        this.language.next(language);
      } else {
        this.language.next(this.language.value);
      }

      return updateInfo;
    }));
  }

  updateColorMode(colorMode: ColorMode): Observable<UpdateInfo> {
    const previousValue: DisplaySettings = {
      ...this.display.value,
    };

    return this.updateSettings({ colorMode }).pipe(map((updateInfo) => {
      if (updateInfo.successful) {
        previousValue.colorMode = colorMode;
      }

      this.display.next(previousValue);

      return updateInfo;
    }));
  }

  toggleNotification(notification: keyof NotificationSettings): Observable<UpdateInfo> {
    const previousValue: NotificationSettings = {
      ...this.notifications.value,
    };

    return this.updateSettings({ [notification]: !previousValue[notification] })
      .pipe(map((updateInfo) => {
        if (updateInfo.successful) {
          previousValue[notification] = !previousValue[notification];
        }

        this.notifications.next(previousValue);

        return updateInfo;
      }));
  }

  inferSnackbarPosition<T extends SnackbarPosition>(pos: T): InferSnackbarPosition<T> {
    const [vertical, horizontal] = <[MatSnackBarVerticalPosition, MatSnackBarHorizontalPosition]>pos.split('-');

    return <InferSnackbarPosition<T>>{
      vertical,
      horizontal,
    };
  }

  updateSnackbarPosition(position: InferSnackbarPosition<SnackbarPosition>): Observable<UpdateInfo> {
    const previousValue: DisplaySettings = {
      ...this.display.value,
    };

    return this.updateSettings({
      snackbarPosition: <SnackbarPosition>`${position.vertical}-${position.horizontal}`
    }).pipe(map((updateInfo) => {
      if (updateInfo.successful) {
        previousValue.snackbarPosition = position;
      }

      this.display.next(previousValue);

      return updateInfo;
    }));
  }

  updateDateFormat(dateFormat: string): Observable<UpdateInfo> {
    const previousValue: DisplaySettings = {
      ...this.display.value,
    };

    return this.updateSettings({ dateFormat })
      .pipe(map((updateInfo) => {
        if (updateInfo.successful) {
          previousValue.dateFormat = dateFormat;
        }

        this.display.next(previousValue);

        return updateInfo;
      }));
  }
  updateTimeFormat(timeFormat: string): Observable<UpdateInfo> {
    const previousValue: DisplaySettings = {
      ...this.display.value,
    };

    return this.updateSettings({ timeFormat })
      .pipe(map((updateInfo) => {
        if (updateInfo.successful) {
          previousValue.timeFormat = timeFormat;
        }

        this.display.next(previousValue);

        return updateInfo;
      }));
  }

  updatePrimaryActionPosition(position: PrimaryActionPosition): Observable<UpdateInfo> {
    const previousValue: DisplaySettings = {
      ...this.display.value,
    };

    return this.updateSettings({ primaryActionPosition: position })
      .pipe(map((updateInfo) => {
        if (updateInfo.successful) {
          previousValue.primaryActionPosition = position;
        }

        this.display.next(previousValue);

        return updateInfo;
      }));
  }

  private updateSettings(updateField: Partial<Entities.AppSettings>): Observable<UpdateInfo> {
    if (this.id) {
      return <Observable<UpdateInfo>>this.update<boolean>({
        route: ':id',
        ids: this.id,
        data: {
          ...updateField,
        },
      }).pipe(
        take(1),
        switchMap((successful) => {
          return of({
            successful,
            toastMessage: `snackbar.changes.${successful ? 'success' : 'failure.warning'}`,
            toastType: <ToastType>(successful ? 'info' : 'warning'),
            error: null,
            exception: null,
          });
        }),
        catchError((err) => {
          if (err !== null) {
            return of({
              successful: false,
              toastMessage: 'snackbar.changes.failure.error',
              toastType: 'error',
              error: null,
              exception: err,
            });
          }

          return of({
            successful: false,
            toastMessage: 'snackbar.changes.failure.warning',
            toastType: 'error',
            error: err,
            exception: null,
          });
        }),
      );
    }

    return of({
      successful: false,
      toastMessage: 'snackbar.settings.changes.no-id',
      toastType: 'warning',
      error: null,
      exception: null,
    });
  }
}
