import { AsyncPipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { Observable, of, startWith, switchMap } from 'rxjs';

import { ProjectMember, ProjectRole } from '@Models/project-member';
import { User } from '@Models/user';
import { FullTitleNamePipe } from '@Pipes/full-title-name.pipe';
import { UserService } from '@Services/user.service';
import { DeepPartial, Nullable } from '@Types';
import { FormValidators } from '@Validators';

type DialogData = {
  role: ProjectRole;
};

@Component({
  selector: 'hsel-invite-project-member',
  templateUrl: './invite-project-member.component.html',
  styleUrl: './invite-project-member.component.scss',
  standalone: true,
  imports: [
    AsyncPipe,
    FormsModule,
    FullTitleNamePipe,
    MatAutocompleteModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
})
export class InviteProjectMemberComponent implements OnInit {
  selectedUser = new FormControl<string | User>('', [FormValidators.required]);
  role = new FormControl<ProjectRole>(ProjectRole.Contributor, [FormValidators.required]);
  filteredUsers!: Observable<User[]>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private readonly dialogRef: MatDialogRef<InviteProjectMemberComponent>,
    private readonly users: UserService,
  ) {}

  ngOnInit(): void {
    this.role.patchValue(this.data.role);

    this.filteredUsers = this.selectedUser.valueChanges.pipe(
      startWith(''),
      switchMap((value) => {
        const searchTerm = typeof value === 'string' ? value : this.displayWithFn(value, false);

        return searchTerm ? this._filter(searchTerm) : of([]);
      }),
    );
  }

  displayWithFn(user: Nullable<User>, includeMatriculationNumber = true): string {
    if (!user) return '';

    const label: string[] = [];

    if (user.academicTitle) label.push(user.academicTitle);
    if (user.firstName) label.push(user.firstName);
    if (user.lastName) label.push(user.lastName);
    if (includeMatriculationNumber && user.matriculationNumber) {
      label.push(`(${user.matriculationNumber})`);
    }

    return label.join(' ');
  }

  private _filter(name: string): Observable<User[]> {
    return this.users.search(name);
  }

  onCancelClick(): void {
    this.dialogRef.close(null);
  }

  getCloseData(): DeepPartial<ProjectMember> {
    let user: DeepPartial<User> = {};

    if (this.selectedUser.value !== null && typeof this.selectedUser.value !== 'string') {
      user = this.selectedUser.value;
    }

    return {
      role: this.data.role,
      user,
    };
  }

  get isUserSelected(): boolean {
    if (this.selectedUser.value === null || typeof this.selectedUser.value === 'string') {
      return false;
    }

    return Object.hasOwn(this.selectedUser.value, 'id');
  }
}
