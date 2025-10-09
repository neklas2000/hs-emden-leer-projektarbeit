import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';

import { TranslatePipe } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';

import { I18nModule } from '../../components/i18n/i18n.module';
import { FooterComponent } from '../../components/layout/footer/footer.component';
import { AppLanguage, AppSettingsService, ColorMode, NotificationSettings, PrimaryActionPosition, SnackbarPosition, UpdateInfo } from '../../services/app-settings.service';
import { SnackbarMessage, SnackbarService } from '../../services/snackbar.service';
import { TitleService } from '../../services/title.service';
import { IterableObject } from '../../utils/iterable-object';

type Format = {
  format: string;
  name: string;
};

type LanguageData = {
  imagePath: string;
  i18nKey: string;
};

@Component({
  selector: 'hsel-settings',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    I18nModule,
    MatSelectModule,
    TranslatePipe,
    DatePipe,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatRadioModule,
    MatToolbarModule,
    FooterComponent,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  standalone: true,
})
export class SettingsComponent implements OnInit, OnDestroy {
  now = new Date();
  snackbarPositions: SnackbarPosition[] = [
    SnackbarPosition.TOP_LEFT,
    SnackbarPosition.TOP_CENTER,
    SnackbarPosition.TOP_RIGHT,
    SnackbarPosition.BOTTOM_LEFT,
    SnackbarPosition.BOTTOM_CENTER,
    SnackbarPosition.BOTTOM_RIGHT,
  ];
  primaryActionPositions: PrimaryActionPosition[] = [
    PrimaryActionPosition.BOTTOM_RIGHT,
    PrimaryActionPosition.TOOLBAR_BOTTOM_RIGHT,
  ];
  dateFormats: Format[] = [
    {
      format: 'dd/MM/YYYY',
      name: 'settings.display.date-format.separator.slash.day-month-year',
    },
    {
      format: 'YYYY/MM/dd',
      name: 'settings.display.date-format.separator.slash.year-month-day',
    },
    {
      format: 'YYYY.MM.dd',
      name: 'settings.display.date-format.separator.dot.year-month-day',
    },
    {
      format: 'dd.MM.YYYY',
      name: 'settings.display.date-format.separator.dot.day-month-year',
    },
    {
      format: 'MM.dd.YYYY',
      name: 'settings.display.date-format.separator.dot.month-day-year',
    },
  ];
  timeFormats: Format[] = [
    {
      format: 'HH:mm',
      name: 'settings.display.time-format.24-hours',
    },
    {
      format: 'hh:mm a',
      name: 'settings.display.time-format.12-hours',
    },
  ];
  languages = new IterableObject<AppLanguage, LanguageData>({
    de: {
      imagePath: 'de-flag.png',
      i18nKey: 'german',
    },
    en: {
      imagePath: 'us-flag.png',
      i18nKey: 'english',
    },
  });
  activeColorMode: ColorMode = ColorMode.LIGHT;
  activeDateFormat: Format = this.dateFormats[3];
  activeTimeFormat: Format = this.timeFormats[0];
  activeLanguage: AppLanguage = AppLanguage.ENGLISH;
  activeSnackbarPosition: SnackbarPosition = SnackbarPosition.TOP_RIGHT;
  activePrimaryActionPosition: PrimaryActionPosition = PrimaryActionPosition.BOTTOM_RIGHT;
  notificationsFormGroup: FormGroup = new FormGroup({
    projectInvitation: new FormControl(true, [Validators.required]),
    projectChanges: new FormControl(true, [Validators.required]),
    newProjectReport: new FormControl(true, [Validators.required]),
    newProjectReportAttachPdf: new FormControl(true, [Validators.required]),
    latestProjectReportChanges: new FormControl(true, [Validators.required]),
    latestProjectReportChangesAttachPdf: new FormControl(true, [Validators.required]),
  });
  private languageSubscription!: Subscription;
  private displaySubscription!: Subscription;
  private notificationsSubscription!: Subscription;

  constructor(
    readonly appSettings: AppSettingsService,
    private readonly title: TitleService,
    private readonly snackbar: SnackbarService,
  ) {}

  ngOnInit(): void {
    this.title.update({ title: 'app.pages.settings.title.long' });

    this.languageSubscription = this.appSettings.language$.subscribe((language) => {
      this.activeLanguage = language;
    });
    this.displaySubscription = this.appSettings.display$.subscribe((displaySettings) => {
      this.activeColorMode = displaySettings.colorMode;
      this.activeDateFormat = this.dateFormats.find(
        (dateFormat) => dateFormat.format === displaySettings.dateFormat,
      ) || this.dateFormats[3];
      this.activeTimeFormat = this.timeFormats.find(
        (timeFormat) => timeFormat.format === displaySettings.timeFormat,
      ) || this.timeFormats[0];
      this.activeSnackbarPosition = <SnackbarPosition>[
        displaySettings.snackbarPosition.vertical,
        displaySettings.snackbarPosition.horizontal,
      ].join('-');
      this.activePrimaryActionPosition = displaySettings.primaryActionPosition;
    });
    this.notificationsSubscription = this.appSettings.notifications$.subscribe({
      next: (notificationSettings) => {
        this.notificationsFormGroup.setValue({
          ...notificationSettings,
        });
      },
    });
  }

  ngOnDestroy(): void {
    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }

    if (this.displaySubscription) {
      this.displaySubscription.unsubscribe();
    }

    if (this.notificationsSubscription) {
      this.notificationsSubscription.unsubscribe();
    }
  }

  onLanguageChange(language: AppLanguage): void {
    this.handleAppSettingsUpdate(this.appSettings.updateLanguage(language));
  }

  setLightMode(): void {
    this.handleAppSettingsUpdate(this.appSettings.updateColorMode(ColorMode.LIGHT));
  }

  setDarkMode(): void {
    this.handleAppSettingsUpdate(this.appSettings.updateColorMode(ColorMode.DARK));
  }

  onColorModeChange(changes: MatRadioChange<ColorMode>): void {
    this.handleAppSettingsUpdate(this.appSettings.updateColorMode(changes.value));
  }

  updateSnackbarPosition(position: SnackbarPosition): void {
    const inferredPosition = this.appSettings.inferSnackbarPosition(position);
    this.handleAppSettingsUpdate(this.appSettings.updateSnackbarPosition(inferredPosition));
  }

  onDateFormatChange(dateFormat: Format): void {
    this.handleAppSettingsUpdate(this.appSettings.updateDateFormat(dateFormat.format));
  }

  onTimeFormatChange(timeFormat: Format): void {
    this.handleAppSettingsUpdate(this.appSettings.updateTimeFormat(timeFormat.format));
  }

  updatePrimaryActionPosition(position: PrimaryActionPosition): void {
    this.handleAppSettingsUpdate(this.appSettings.updatePrimaryActionPosition(position));
  }

  onClickSnackbarPreview(): void {
    this.snackbar.info(SnackbarMessage.PREVIEW);
  }

  toggleNotification(notification: keyof NotificationSettings): void {
    this.handleAppSettingsUpdate(this.appSettings.toggleNotification(notification));
  }

  private handleAppSettingsUpdate(request$: Observable<UpdateInfo>): void {
    request$.subscribe((updateInfo) => {
      if (updateInfo.successful) {
        this.snackbar.info(updateInfo.toastMessage);
      } else if (updateInfo.error === null && updateInfo.exception === null) {
        this.snackbar.warn(updateInfo.toastMessage);
      } else if (updateInfo.error !== null) {
        this.snackbar.error(updateInfo.toastMessage);
        console.log(updateInfo.error);
      } else {
        this.snackbar.errorWithCode(updateInfo.toastMessage, updateInfo.exception);
        console.log(updateInfo.exception);
      }
    });
  }
}
