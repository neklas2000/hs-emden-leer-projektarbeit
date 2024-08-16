import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'hsel-confirm-milestone-deletion',
  templateUrl: './confirm-milestone-deletion.component.html',
  styleUrl: './confirm-milestone-deletion.component.scss',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
  ],
})
export class ConfirmMilestoneDeletionComponent {
  constructor(private readonly dialogRef: MatDialogRef<ConfirmMilestoneDeletionComponent>) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
