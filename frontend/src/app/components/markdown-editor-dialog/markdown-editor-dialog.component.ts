import { Component, Inject } from '@angular/core';
import {
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

type DialogData = {
  isImage: boolean;
};

@Component({
  selector: 'app-markdown-editor-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
  templateUrl: './markdown-editor-dialog.component.html',
  styleUrl: './markdown-editor-dialog.component.scss'
})
export class MarkdownEditorDialogComponent {
  uri: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<MarkdownEditorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}

  onCancelClick(): void {
    this.dialogRef.close();
  }
}
