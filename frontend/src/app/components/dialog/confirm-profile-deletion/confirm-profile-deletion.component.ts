import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'hsel-confirm-profile-deletion',
  templateUrl: './confirm-profile-deletion.component.html',
  styleUrl: './confirm-profile-deletion.component.scss',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
  ],
})
export class ConfirmProfileDeletionComponent {
  constructor(private readonly dialogRef: MatDialogRef<ConfirmProfileDeletionComponent>) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
