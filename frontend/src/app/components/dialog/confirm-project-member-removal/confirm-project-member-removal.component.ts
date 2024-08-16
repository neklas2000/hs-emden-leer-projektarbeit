import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'hsel-confirm-project-member-removal',
  templateUrl: './confirm-project-member-removal.component.html',
  styleUrl: './confirm-project-member-removal.component.scss',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
  ],
})
export class ConfirmProjectMemberRemovalComponent {
  constructor(private readonly dialogRef: MatDialogRef<ConfirmProjectMemberRemovalComponent>) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
