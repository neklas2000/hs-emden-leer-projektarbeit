import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AsyncPipe } from '@angular/common';

import { Observable, take } from 'rxjs';

import { ProjectRole } from '@Models/project-member';
import { User } from '@Models/user';
import { JsonApiDatastore } from '@Services/json-api-datastore.service';
import { Nullable } from '@Types';

type DialogData = {
  role: Nullable<ProjectRole>;
};

@Component({
  selector: 'hsel-invite-project-member-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
    MatAutocompleteModule,
    AsyncPipe,
    ReactiveFormsModule,
  ],
  templateUrl: './invite-project-member-dialog.component.html',
  styleUrl: './invite-project-member-dialog.component.scss'
})
export class InviteProjectMemberDialogComponent implements OnInit {
  selectedUser!: Nullable<User>;
  users!: Observable<User[]>;

  constructor(
    public dialogRef: MatDialogRef<InviteProjectMemberDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private readonly jsonApiDatastore: JsonApiDatastore,
  ) {}

  ngOnInit(): void {
    this.users = this.jsonApiDatastore.loadAll<User>(User, {
      sparseFieldsets: {
        user: ['id', 'firstName', 'lastName']
      }
    }).pipe(take(1));
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }
}
