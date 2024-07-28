import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';

/**
 * @description
 * This service wraps the material dialog component and provides default configurations
 * when opening a dialog window. This service can at best be used by taking advantage of the
 * dependency injection, as follows.
 *
 * @usageNotes
 * ### Using this service through dependency injection
 * ```ts
 * \@Injectable({ providedIn: 'root' }) // This defines an injection context
 * class ExampleComponent {
 *    constructor(private readonly dialog: DialogService) {}
 * }
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private readonly dialog: MatDialog) {}

  /**
   * @description
   * The provided dialog component will be opened with a minimal width of 60dvw and a maximal
   * width of 80dvw by default. Additional configuration can be performed by providing an
   * `MatDialogConfig` object as the second parameter.
   *
   * @usageNotes
   * ### Open a dialog
   * ```ts
   * const dialog = inject(DialogService); // Inside of an injection context
   * const dialogRef = dialog.open(HelloWorldComponent);
   * ```
   *
   * @param component The dialog component which will be displayed inside the material dialog.
   * @param config The material dialog configuration object - default: empty object.
   *
   * @returns A reference to the dialog.
   */
  open<T>(component: ComponentType<T>, config: MatDialogConfig<any> = {}): MatDialogRef<T, any> {
    return this.dialog.open(component, {
      minWidth: '60dvw',
      maxWidth: '80dvw',
      ...config,
    });
  }
}
