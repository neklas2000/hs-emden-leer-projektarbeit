import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { take } from 'rxjs';

import { User } from '@Models/user';
import { ProfileService } from '@Services/profile.service';
import { DeepPartial, Nullable } from '@Types';
import { FormValidators } from '../../../../validators';
import { SnackbarService } from '@Services/snackbar.service';
import { HttpException } from '@Utils/http-exception';

type Form = FormGroup<{
  academicTitle: FormControl<Nullable<string>>;
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  matriculationNumber: FormControl<Nullable<number>>;
  phoneNumber: FormControl<Nullable<string>>;
}>;

@Component({
  selector: 'hsel-edit-personal-information',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
  ],
  templateUrl: './edit-personal-information.component.html',
  styleUrl: './edit-personal-information.component.scss'
})
export class EditPersonalInformationComponent implements OnInit, OnChanges {
  @Input() profile!: DeepPartial<User>;
  @Output() onCancel: EventEmitter<void> = new EventEmitter();
  @Output() onSubmit: EventEmitter<DeepPartial<User>> = new EventEmitter();
  form: Form = this.formBuilder.group({
    academicTitle: ['', []],
    firstName: ['', [FormValidators.required]],
    lastName: ['', [FormValidators.required]],
    matriculationNumber: [null, [FormValidators.required]],
    phoneNumber: ['', [FormValidators.phoneNumber]],
  }) as any;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly profileService: ProfileService,
    private readonly snackbar: SnackbarService,
  ) {}

  ngOnInit(): void {
    console.log('ngOnInit');
    this.form.setValue({
      academicTitle: this.profile.academicTitle ?? null,
      firstName: this.profile.firstName ?? '',
      lastName: this.profile.lastName ?? '',
      matriculationNumber: this.profile.matriculationNumber ?? null,
      phoneNumber: this.profile.phoneNumber ?? null,
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('ngOnChanges', changes);
  }

  saveChanges(): void {
    if (!this.profile.id) {
      this.snackbar.open('Änderungen können nicht gespeichert werden');

      return;
    }

    const data = {
      academicTitle: this.form.get('academicTitle')!.value,
      firstName: this.form.get('firstName')!.value,
      lastName: this.form.get('lastName')!.value,
      matriculationNumber: this.form.get('matriculationNumber')?.value ?? undefined,
      phoneNumber: this.form.get('phoneNumber')!.value,
    };

    this.profileService.update<User>(':id', this.profile.id, data)
      .pipe(take(1))
        .subscribe({
          next: (isProfileUpdated) => {
            if (isProfileUpdated) {
              this.snackbar.open('Änderungen gespeichert');
              this.onSubmit.emit(data);
            } else {
              this.snackbar.open('Änderungen nicht gespeichert');
              this.onCancel.emit();
            }
          },
          error: (exception: HttpException) => {
            let message = 'Es ist ein Fehler aufgetreten';

            if (exception.code.length > 0) {
              message += ` (${exception.code})`;
            }

            this.snackbar.open(message);
            this.onCancel.emit();
          },
        });
  }
}
