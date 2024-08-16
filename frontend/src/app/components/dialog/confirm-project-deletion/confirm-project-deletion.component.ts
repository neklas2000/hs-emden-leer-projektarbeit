import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'hsel-confirm-project-deletion',
  templateUrl: './confirm-project-deletion.component.html',
  styleUrl: './confirm-project-deletion.component.scss',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
  ],
})
export class ConfirmProjectDeletionComponent {
  constructor(private readonly dialogRef: MatDialogRef<ConfirmProjectDeletionComponent>) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
