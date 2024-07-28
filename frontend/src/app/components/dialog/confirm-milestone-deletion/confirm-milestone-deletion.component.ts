import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'hsel-confirm-milestone-deletion',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
  ],
  templateUrl: './confirm-milestone-deletion.component.html',
  styleUrl: './confirm-milestone-deletion.component.scss'
})
export class ConfirmMilestoneDeletionComponent {
  constructor(private readonly dialogRef: MatDialogRef<ConfirmMilestoneDeletionComponent>) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
