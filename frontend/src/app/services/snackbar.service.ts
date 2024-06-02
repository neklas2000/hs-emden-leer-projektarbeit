import { HttpException } from '@Utils/http-exception';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  constructor(private readonly snackbar: MatSnackBar) { }

  /**
   * This function opens a snack-bar to provide feedback to the user.
   * For example, it can be used to show the user that a resource was successfully created, edited,
   * deleted etc.
   * The duration is a time in milliseconds, which defines for how long the snack-bar is visible.
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
   * This function opens a snack-bar to provide feedback to the user when an exception has been
   * raised. It wraps the function `open` by calling it internally with the message being extended
   * by the custom exception code (if present).
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
