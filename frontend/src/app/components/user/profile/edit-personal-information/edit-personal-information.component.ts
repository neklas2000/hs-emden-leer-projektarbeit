import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { take } from 'rxjs';

import { User } from '@Models/user';
import { ProfileService } from '@Services/profile.service';
import { SnackbarMessage, SnackbarService } from '@Services/snackbar.service';
import { DeepPartial, Nullable } from '@Types';
import { HttpException } from '@Utils/http-exception';
import { FormValidators } from '@Validators';

type Form = FormGroup<{
  academicTitle: FormControl<Nullable<string>>;
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  matriculationNumber: FormControl<Nullable<number>>;
  phoneNumber: FormControl<Nullable<string>>;
}>;

@Component({
  selector: 'hsel-edit-personal-information',
  templateUrl: './edit-personal-information.component.html',
  styleUrl: './edit-personal-information.component.scss',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
})
export class EditPersonalInformationComponent implements OnInit {
  @Input() profile!: DeepPartial<User>;
  @Output() onCancel: EventEmitter<void> = new EventEmitter();
  @Output() onSubmit: EventEmitter<DeepPartial<User>> = new EventEmitter();
  form: Form = this.formBuilder.group({
    academicTitle: new FormControl<Nullable<string>>(null),
    firstName: new FormControl<Nullable<string>>(null, [FormValidators.required]),
    lastName: new FormControl<Nullable<string>>(null, [FormValidators.required]),
    matriculationNumber: new FormControl<Nullable<number>>(null),
    phoneNumber: new FormControl<Nullable<string>>(null, [FormValidators.phoneNumber]),
  }) as any;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly profileService: ProfileService,
    private readonly snackbar: SnackbarService,
  ) {}

  ngOnInit(): void {
    this.form.setValue({
      academicTitle: this.profile.academicTitle ?? null,
      firstName: this.profile.firstName ?? '',
      lastName: this.profile.lastName ?? '',
      matriculationNumber: this.profile.matriculationNumber ?? null,
      phoneNumber: this.profile.phoneNumber ?? null,
    });
  }

  saveChanges(): void {
    if (!this.profile.id) {
      this.snackbar.open('Änderungen können nicht gespeichert werden');

      return;
    }

    const data = {
      academicTitle: this.form.get('academicTitle')!.value ?? null,
      firstName: this.form.get('firstName')!.value,
      lastName: this.form.get('lastName')!.value,
      matriculationNumber: this.form.get('matriculationNumber')!.value ?? null,
      phoneNumber: this.form.get('phoneNumber')!.value ?? null,
    };

    this.profileService.update(':id', this.profile.id, data)
      .pipe(take(1))
        .subscribe({
          next: (isProfileUpdated) => {
            if (isProfileUpdated) {
              this.snackbar.showInfo(SnackbarMessage.SAVE_OPERATION_SUCCEEDED);
              this.onSubmit.emit(data);
            } else {
              this.snackbar.showWarning(SnackbarMessage.SAVE_OPERATION_FAILED_CONFIRMATION);
              this.onCancel.emit();
            }
          },
          error: (exception: HttpException) => {
            this.snackbar.showException(SnackbarMessage.SAVE_OPERATION_FAILED, exception);
            this.onCancel.emit();
          },
        });
  }
}
