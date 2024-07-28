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

import { ProjectMember, ProjectRole } from '@Models/project-member';
import { User } from '@Models/user';
import { UserService } from '@Services/user.service';
import { DeepPartial, Nullable } from '@Types';

type DialogData = {
  role: ProjectRole;
};

@Component({
  selector: 'hsel-invite-project-member',
  standalone: true,
  imports: [
    AsyncPipe,
    FormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './invite-project-member.component.html',
  styleUrl: './invite-project-member.component.scss'
})
export class InviteProjectMemberComponent implements OnInit {
  selectedUser!: Nullable<User>;
  users!: Observable<User[]>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private readonly dialogRef: MatDialogRef<InviteProjectMemberComponent>,
    private readonly userService: UserService,
  ) {}

  ngOnInit(): void {
    this.users = this.userService.readAll('', {
      sparseFieldsets: {
        user: ['id', 'academicTitle', 'firstName', 'lastName'],
      },
    }).pipe(take(1));
  }

  onCancelClick(): void {
    this.dialogRef.close(null);
  }

  getCloseData(): DeepPartial<ProjectMember> {
    return {
      role: this.data.role,
      user: {
        ...(this.selectedUser ?? {})
      },
    };
  }
}
