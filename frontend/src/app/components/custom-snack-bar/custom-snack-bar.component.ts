import { Component, Inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MAT_SNACK_BAR_DATA, MatSnackBarLabel } from '@angular/material/snack-bar';

export type SnackBarType = 'info' | 'warning' | 'error';

type SnackBarData = {
  label: string;
  type: SnackBarType;
};

@Component({
  selector: 'hsel-custom-snack-bar',
  templateUrl: './custom-snack-bar.component.html',
  styleUrl: './custom-snack-bar.component.scss',
  standalone: true,
  imports: [
    MatIconModule,
    MatSnackBarLabel,
  ],
})
export class CustomSnackBarComponent {
  colorMap = {
    info: 'var(--info)',
    warning: 'var(--warning)',
    error: 'var(--warn-color)',
  };

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: SnackBarData) { }
}
