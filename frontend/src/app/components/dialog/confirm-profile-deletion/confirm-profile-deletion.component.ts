import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'hsel-confirm-profile-deletion',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
  ],
  templateUrl: './confirm-profile-deletion.component.html',
  styleUrl: './confirm-profile-deletion.component.scss'
})
export class ConfirmProfileDeletionComponent {
  constructor(private readonly dialogRef: MatDialogRef<ConfirmProfileDeletionComponent>) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
