import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { CustomSnackBarComponent, SnackBarType } from '@Components/custom-snack-bar/custom-snack-bar.component';
import { HttpException } from '@Utils/http-exception';

/**
 * @description
 * This enumeration provides default snack-bar messages for the application.
 */
export enum SnackbarMessage {
  CANCELED = 'Vorgang abgebrochen',
  DELETE_OPERATION_CANCELED = 'Löschvorgang abgebrochen',
  SAVE_OPERATION_FAILED = 'Speichervorgang fehlgeschlagen',
  DELETE_OPERATION_FAILED = 'Löschvorgang fehlgeschlagen',
  DELETE_OPERATION_SUCCEEDED = 'Löschvorgang erfolgreich',
}

/**
 * @description
 * This service can be used to provide the user with feedback of the success or failure from the
 * operations he/she performed.
 */
@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  constructor(private readonly snackbar: MatSnackBar) { }

  /**
   * @description
   * This function opens a snack-bar to provide feedback to the user. For example, it can be used
   * to show the user that a resource was successfully created, edited, deleted etc.
   * The duration is a time in milliseconds, which defines for how long the snack-bar is visible.
   *
   * @usageNotes
   * ### Showing a snackbar with a message
   * ```ts
   * const snackbar = inject(SnackbarService); // Inside of an injection context
   * snackbar.open('Hello World'); // Shows the message "Hello World" für three seconds
   * ```
   *
   * @param message The message to be shown.
   * @param duration The amount of milliseconds to show the snack-bar - default: 3000
   */
  open(message: string, duration: number = 3000): void {
    this.openFromCustomComponent(message, 'info', duration);
  }

  /**
   * @description
   * This function opens a snack-bar to provide feedback to the user when an exception has been
   * raised. The message will be extended by the custom exception code (if present).
   *
   * @usageNotes
   * ### Showing a snackbar with an exception code
   * ```ts
   * const snackbar = inject(SnackbarService); // Inside of an injection context
   * const http = inject(HttpClient); // Inside of an injection context
   *
   * http.get('/api/helloworld').subscribe({
   *    error: (error) => {
   *      snackbar.showException(SnackbarMessage.SAVE_OPERATION_FAILED, new HttpException(error));
   *    },
   * });
   * ```
   *
   * @param message The message to be shown.
   * @param exception The exception which has been raised.
   * @param duration The amount of milliseconds to show the snack-bar - default: 7000
   */
  showException(message: string, exception: HttpException, duration: number = 7000): void {
    if (exception.code.length > 0) {
      message += ` (${exception.code})`;
    }

    console.error(`
      [${exception.timestamp}] An exception occurred while accessing ${exception.requestPath}\r\n
      ${exception.name}: ${exception.message}\r\n\r\n
      ${exception.description}
    `.trim());

    this.openFromCustomComponent(message, 'error', duration);
  }

  /**
   * @description
   * This function opens a snack-bar to provide informative feedback to the user when for example an
   * operation has succeeded.
   *
   * @usageNotes
   * ### Showing an informative snackbar
   * ```ts
   * const snackbar = inject(SnackbarService); // Inside of an injection context
   * snackbar.showInfo('Speichervorgang erfolgreich abgeschlossen');
   * ```
   *
   * @param message The message to be shown.
   * @param duration The amount of milliseconds to show the snack-bar - default: 3000
   */
  showInfo(message: string, duration: number = 3000): void {
    this.openFromCustomComponent(message, 'info', duration);
  }

  /**
   * @description
   * This function opens a snack-bar to provide warning feedback to the user when for example the
   * update of a resource couldn't be validated because the sql script didn't return an amount of
   * affected rows.
   *
   * @usageNotes
   * ### Showing a warning snackbar
   * ```ts
   * const snackbar = inject(SnackbarService); // Inside of an injection context
   * snackbar.showWarning('Speichervorgang konnte nicht bestätigt werden');
   * ```
   *
   * @param message The message to be shown.
   * @param duration The amount of milliseconds to show the snack-bar - default: 5000
   */
  showWarning(message: string, duration: number = 5000): void {
    this.openFromCustomComponent(message, 'warning', duration);
  }

  /**
   * @description
   * This function opens a snack-bar to provide feedback to the user about an error which occurred.
   *
   * @usageNotes
   * ### Showing an error snackbar
   * ```ts
   * const snackbar = inject(SnackbarService); // Inside of an injection context
   * snackbar.showError('Es ist ein Fehler aufgetreten (HSEL-500-001)');
   * ```
   *
   * @param message The message to be shown.
   * @param duration The amount of milliseconds to show the snack-bar - default: 7000
   */
  showError(message: string, duration: number = 7000): void {
    this.openFromCustomComponent(message, 'error', duration);
  }

  /**
   * @description
   * This function opens a snack-bar to provide feedback to the user. It takes a label (the message
   * to be shown), the type (info, warning or error) and the duration. With this information the
   * material snack-bar will be opened using a custom component which extends the label with an icon
   * which again represents the type.
   *
   * @usageNotes
   * ### Showing a snackbar (type was randomly chosen)
   * ```ts
   * const snackbar = inject(SnackbarService); // Inside of an injection context
   * snackbar.openFromCustomComponent('Hello World', 'info', 3000);
   * ```
   *
   * @param label The message to be shown.
   * @param type The type of the snack-bar (either ``'info'``, ``'warning'`` or ``'error'``).
   * @param duration The amount of milliseconds to show the snack-bar.
   */
  private openFromCustomComponent(label: string, type: SnackBarType, duration: number): void {
    this.snackbar.openFromComponent(CustomSnackBarComponent, {
      duration,
      data: {
        label,
        type,
      },
      panelClass: `snack-bar-${type}`,
      direction: 'ltr',
      horizontalPosition: 'left',
      verticalPosition: 'bottom',
    });
  }
}
