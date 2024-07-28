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

import { Nullable } from '@Types';

type DialogData = {
  isImage: boolean;
};

@Component({
  selector: 'hsel-markdown-provide-external-url',
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
  templateUrl: './markdown-provide-external-url.component.html',
  styleUrl: './markdown-provide-external-url.component.scss'
})
export class MarkdownProvideExternalUrlComponent {
  uri: Nullable<string> = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private readonly dialogRef: MatDialogRef<MarkdownProvideExternalUrlComponent>,
  ) {}

  onCancelClick(): void {
    this.dialogRef.close();
  }
}
