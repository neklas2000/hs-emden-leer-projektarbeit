import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { HttpException } from '@Utils/http-exception';

/**
 * @description
 * This enumeration provides default snack-bar messages for the application.
 */
export enum SnackbarMessage {
  CANCELED = 'Vorgang abgebrochen',
  SAVE_OPERATION_FAILED = 'Speichervorgang fehlgeschlagen',
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
    this.snackbar.open(message, undefined, {
      duration,
      direction: 'ltr',
      horizontalPosition: 'left',
      verticalPosition: 'bottom',
      announcementMessage: message,
    });
  }

  /**
   * @description
   * This function opens a snack-bar to provide feedback to the user when an exception has been
   * raised. It wraps the function `open` by calling it internally with the message being extended
   * by the custom exception code (if present).
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
   * @param duration The amount of milliseconds to show the snack-bar - default: 5000
   */
  showException(message: string, exception: HttpException, duration: number = 5000): void {
    if (exception.code.length > 0) {
      message += ` (${exception.code})`;
    }

    console.error(`
      [${exception.timestamp}] An exception occurred while accessing ${exception.requestPath}\r\n
      ${exception.name}: ${exception.message}\r\n\r\n
      ${exception.description}
    `.trim());

    this.open(message, duration);
  }
}
