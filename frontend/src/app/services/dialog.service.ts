import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(private readonly dialog: MatDialog) {}

  open<T>(component: ComponentType<T>, config: MatDialogConfig<any> = {}): MatDialogRef<T, any> {
    return this.dialog.open(component, {
      ...config,
      minWidth: '60dvw',
      maxWidth: '80dvw',
    });
  }
}
