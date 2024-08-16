import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { Nullable } from '@Types';

type DialogData = {
  isImage: boolean;
};

@Component({
  selector: 'hsel-markdown-provide-external-url',
  templateUrl: './markdown-provide-external-url.component.html',
  styleUrl: './markdown-provide-external-url.component.scss',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
  ],
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
