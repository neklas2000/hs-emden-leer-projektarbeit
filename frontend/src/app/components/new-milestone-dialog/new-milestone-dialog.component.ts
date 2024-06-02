import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { ProjectMilestone } from '@Models/project-milestone';

@Component({
  selector: 'hsel-new-milestone-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './new-milestone-dialog.component.html',
  styleUrl: './new-milestone-dialog.component.scss'
})
export class NewMilestoneDialogComponent {
  milestone: ProjectMilestone = new ProjectMilestone();
  form = new FormGroup({
    name: new FormControl(this.milestone.name, [Validators.required]),
  });

  constructor(
    private readonly dialogRef: MatDialogRef<NewMilestoneDialogComponent>,
  ) {}

  onCancelClick(): void {
    this.dialogRef.close(null);
  }

  closeWithData(): void {
    this.dialogRef.close({
      ...this.milestone,
      name: this.form.get('name')?.value || this.milestone.name,
    });
  }
}
