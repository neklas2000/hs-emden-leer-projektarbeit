import { Component, Inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MAT_SNACK_BAR_DATA, MatSnackBarModule } from '@angular/material/snack-bar';

export type ToastType = 'info' | 'warning' | 'error';

export type SnackbarData = {
  label: string;
  type: ToastType;
};

@Component({
  selector: 'hsel-custom-snackbar',
  imports: [MatSnackBarModule, MatIconModule],
  templateUrl: './custom-snackbar.component.html',
  styleUrl: './custom-snackbar.component.scss',
  standalone: true,
})
export class CustomSnackbarComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: SnackbarData) {}
}
