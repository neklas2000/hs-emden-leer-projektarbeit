import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { Subscription, take } from 'rxjs';

import { FormValidators } from '../../../../validators';
import { ProfileService } from '@Services/profile.service';
import { User } from '@Models/user';
import { HttpException } from '@Utils/http-exception';
import { SnackbarService } from '@Services/snackbar.service';

export enum Credentials {
  EMAIL = 1,
  PASSWORD = 2,
}

type DialogData = {
  type: Credentials;
  userId: string;
};

@Component({
  selector: 'hsel-edit-credentials',
  standalone: true,
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './edit-credentials.component.html',
  styleUrl: './edit-credentials.component.scss'
})
export class EditCredentialsComponent implements OnInit, OnDestroy {
  EMAIL = Credentials.EMAIL as const;
  form!: FormGroup;
  hideOldPassword = true;
  hidePassword = true;
  hidePasswordRepeat = true;
  private backdrop$!: Subscription;

  constructor(
    public dialogRef: MatDialogRef<EditCredentialsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private readonly formBuilder: FormBuilder,
    private readonly profile: ProfileService,
    private readonly snackbar: SnackbarService,
  ) {}

  ngOnInit(): void {
    this.backdrop$ = this.dialogRef.backdropClick().subscribe((clickEvent) => {
      clickEvent.preventDefault();

      this.onCancelClick();
    });

    switch (this.data.type) {
      case Credentials.EMAIL:
        this.initEmailForm();
        break;
      case Credentials.PASSWORD:
      default:
        this.initPasswordForm();
        break;
    }
  }

  private initEmailForm(): void {
    this.form = this.formBuilder.group({
      oldEmail: ['', [FormValidators.required, FormValidators.email]],
      newEmail: ['', [FormValidators.required, FormValidators.email]],
      newEmailRepeat: ['', [FormValidators.required, FormValidators.email, FormValidators.matchWith('newEmail')]],
      password: ['', [FormValidators.required]],
    });
  }

  private initPasswordForm(): void {
    this.form = this.formBuilder.group({
      password: ['', [FormValidators.required]],
      newPassword: ['', [FormValidators.required]],
      newPasswordRepeat: ['', [FormValidators.required, FormValidators.matchWith('newPassword')]],
    });
  }

  ngOnDestroy(): void {
    if (this.backdrop$) {
      this.backdrop$.unsubscribe();
    }
  }

  onCancelClick(): void {
    this.dialogRef.close(null);
  }

  onSubmitClick(): void {
    this.profile.validateCredentials({
      userId: this.data.userId,
      email: this.form.get('oldEmail')?.value,
      password: this.form.get('password')?.value,
    }).pipe(take(1)).subscribe({
      next: (user) => {
        if (!user) {
          this.snackbar.open('Anmeldedaten fehlerhaft');
        } else if (this.data.type === Credentials.EMAIL) {
          this.updateEmail();
        } else {
          this.updatePassword();
        }
      },
      error: (exception: HttpException) => {
        let message = 'Fehlerhafte Anmeldedaten';

        if (exception.code.length > 0) {
          message += ` (${exception.code})`;
        }

        this.snackbar.open(message);
      },
    });
  }

  private updateEmail(): void {
    this.profile.update<User>(':id', this.data.userId, {
      email: this.form.get('newEmail')?.value,
    }).pipe(take(1)).subscribe({
      next: (updatedSuccessfully) => {
        if (updatedSuccessfully) {
          this.snackbar.open('E-Mail-Adresse aktualisiert');
          this.dialogRef.close(this.form.get('newEmail')?.value ?? null);
        }
      },
      error: (exception: HttpException) => {
        let message = 'E-Mail-Adresse wurde nicht aktualisiert';

        if (exception.code.length > 0) {
          message += ` (${exception.code})`;
        }

        this.snackbar.open(message);
        console.log(exception);
        this.onCancelClick();
      },
    });
  }

  private updatePassword(): void {
    this.profile.update<User>(':id', this.data.userId, {
      password: this.form.get('newPassword')?.value,
    }).pipe(take(1)).subscribe({
      next: (updatedSuccessfully) => {
        if (updatedSuccessfully) {
          this.snackbar.open('Passwort aktualisiert');
          this.onCancelClick();
        }
      },
      error: (exception: HttpException) => {
        let message = 'Passwort wurde nicht aktualisiert';

        if (exception.code.length > 0) {
          message += ` (${exception.code})`;
        }

        this.snackbar.open(message);
        console.log(exception);
        this.onCancelClick();
      },
    });
  }

  toggleOldPasswordHide(clickEvent: MouseEvent): void {
    clickEvent.preventDefault();

    this.hideOldPassword = !this.hideOldPassword;
  }

  togglePasswordHide(clickEvent: MouseEvent): void {
    clickEvent.preventDefault();

    this.hidePassword = !this.hidePassword;
  }

  togglePasswordRepeatHide(clickEvent: MouseEvent): void {
    clickEvent.preventDefault();

    this.hidePasswordRepeat = !this.hidePasswordRepeat;
  }
}
