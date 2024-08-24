import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Data, Router } from '@angular/router';

import { take } from 'rxjs';

import {
  Credentials,
  EditCredentialsComponent
} from '@Components/user/profile/edit-credentials/edit-credentials.component';
import {
  EditPersonalInformationComponent
} from '@Components/user/profile/edit-personal-information/edit-personal-information.component';
import {
  ConfirmProfileDeletionComponent
} from '@Dialogs/confirm-profile-deletion/confirm-profile-deletion.component';
import { User } from '@Models/user';
import { UndefinedStringPipe } from '@Pipes/undefined-string.pipe';
import { AuthenticationService } from '@Services/authentication.service';
import { DialogService } from '@Services/dialog.service';
import { SnackbarMessage, SnackbarService } from '@Services/snackbar.service';
import { UserService } from '@Services/user.service';
import { DeepPartial, DeepPartialWithIdField, Nullable } from '@Types';
import { HttpException } from '@Utils/http-exception';

@Component({
  selector: 'hsel-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  standalone: true,
  imports: [
    EditPersonalInformationComponent,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatSelectModule,
    MatTooltipModule,
    ReactiveFormsModule,
    UndefinedStringPipe,
  ],
})
export class ProfileComponent implements OnInit {
  profile!: DeepPartialWithIdField<User>; // Will be initialized inside #ngOnInit
  private editingPersonalInformation: boolean = false;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly dialog: DialogService,
    private readonly snackbar: SnackbarService,
    private readonly users: UserService,
    private readonly auth: AuthenticationService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.pipe(take(1)).subscribe(({ profile }: Data) => {
      this.profile = profile;
    });
  }

  editPersonalInformation(): void {
    this.editingPersonalInformation = true;
  }

  cancelEditPersonalInformation(): void {
    this.editingPersonalInformation = false;
  }

  get isEditingPersonalInformationActivated(): boolean {
    return this.editingPersonalInformation;
  }

  saveEditedPersonalInformation(updatedProfile: DeepPartial<User>): void {
    this.profile = {
      ...this.profile,
      ...updatedProfile,
    };
    this.cancelEditPersonalInformation();
  }

  editEmail(): void {
    const dialogRef = this.dialog.open(EditCredentialsComponent, {
      data: {
        type: Credentials.EMAIL,
        userId: this.profile.id,
      },
    });

    dialogRef.afterClosed().pipe(take(1)).subscribe((result: Nullable<string>) => {
      if (result) {
        this.profile.email = result;
      }
    });
  }

  editPassword(): void {
    this.dialog.open(EditCredentialsComponent, {
      data: {
        type: Credentials.PASSWORD,
        userId: this.profile.id,
      },
    });
  }

  deleteProfile(): void {
    const dialogRef = this.dialog.open(ConfirmProfileDeletionComponent);

    dialogRef.afterClosed().pipe(take(1)).subscribe((shouldDelete: boolean) => {
      if (shouldDelete) {
        this.deleteUsersProfile();
      } else {
        this.snackbar.showInfo(SnackbarMessage.DELETE_OPERATION_CANCELED);
      }
    });
  }

  private deleteUsersProfile(): void {
    this.users.delete().subscribe({
      next: (deletionSuccessful) => {
        if (!deletionSuccessful) {
          this.snackbar.showWarning(SnackbarMessage.DELETE_OPERATION_FAILED_CONFIRMATION);
        } else {
          this.auth.clear();
          this.snackbar.showInfo(SnackbarMessage.DELETE_OPERATION_SUCCEEDED);
          this.router.navigateByUrl('/');
        }
      },
      error: (exception: HttpException) => {
        this.snackbar.showException(SnackbarMessage.DELETE_OPERATION_FAILED, exception);
      },
    });
  }
}
