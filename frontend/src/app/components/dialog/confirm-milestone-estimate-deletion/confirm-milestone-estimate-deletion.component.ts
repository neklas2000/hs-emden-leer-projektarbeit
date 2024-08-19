import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'hsel-confirm-milestone-estimate-deletion',
  templateUrl: './confirm-milestone-estimate-deletion.component.html',
  styleUrl: './confirm-milestone-estimate-deletion.component.scss',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
  ],
})
export class ConfirmMilestoneEstimateDeletionComponent {
  constructor(
    private readonly dialogRef: MatDialogRef<ConfirmMilestoneEstimateDeletionComponent>,
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
