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
   * @param message the message to be shown.
   * @param duration amount of milliseconds to show the snack-bar - default: 3000
   */
  open(message: string, duration: number = 3000): void {
    this.snackbar.open(message, undefined, {
      duration,
      direction: 'ltr',
      horizontalPosition: 'left',
      verticalPosition: 'bottom',
    });
  }
}
