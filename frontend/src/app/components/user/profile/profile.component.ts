import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Data } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import { take } from 'rxjs';

import { User } from '@Models/user';
import { Nullable } from '@Types';
import { FormValidators } from '../../../validators';

type Form = FormGroup<{
  academicTitle: FormControl<Nullable<string>>;
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  matriculationNumber: FormControl<Nullable<number>>;
  phoneNumber: FormControl<Nullable<string>>;
}>;

@Component({
  selector: 'hsel-profile',
  standalone: true,
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatListModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  profile: Nullable<User> = null;
  form: Form = this.formBuilder.group({
    academicTitle: ['', []],
    firstName: ['', [FormValidators.required]],
    lastName: ['', [FormValidators.required]],
    matriculationNumber: [null, [FormValidators.required]],
    phoneNumber: ['', [FormValidators.phoneNumber]],
  }) as any;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.pipe(take(1)).subscribe(({ profile }: Data) => {
      this.profile = profile;
      this.form.setValue({
        academicTitle: this.profile?.academicTitle ?? '',
        firstName: this.profile?.firstName ?? '',
        lastName: this.profile?.lastName ?? '',
        matriculationNumber: this.profile?.matriculationNumber ?? null,
        phoneNumber: this.profile?.phoneNumber ?? '',
      });
    });
  }
}
