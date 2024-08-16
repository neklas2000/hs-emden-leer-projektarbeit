import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { ProjectMilestone } from '@Models/project-milestone';
import { FormValidators } from '@Validators';

@Component({
  selector: 'hsel-create-new-milestone',
  templateUrl: './create-new-milestone.component.html',
  styleUrl: './create-new-milestone.component.scss',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
})
export class CreateNewMilestoneComponent {
  milestone: ProjectMilestone = new ProjectMilestone();
  form = new FormGroup({
    name: new FormControl(this.milestone.name, [FormValidators.required]),
  });

  constructor(
    private readonly dialogRef: MatDialogRef<CreateNewMilestoneComponent>,
  ) {}

  onCancelClick(): void {
    this.dialogRef.close(null);
  }

  closeWithData(): void {
    this.dialogRef.close({
      ...this.milestone,
      name: this.form.get('name')?.value ?? this.milestone.name,
    });
  }
}
