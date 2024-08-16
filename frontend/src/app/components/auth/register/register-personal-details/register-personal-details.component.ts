import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { Nullable } from '@Types';
import { FormValidators } from '@Validators';

export type PersonalDetails = {
  academicTitle: Nullable<string>;
  firstName: string;
  lastName: string;
  matriculationNumber: number;
  phoneNumber: Nullable<string>;
};

@Component({
  selector: 'hsel-register-personal-details',
  templateUrl: './register-personal-details.component.html',
  styleUrl: './register-personal-details.component.scss',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
})
export class RegisterPersonalDetailsComponent {
  @Output() onBack: EventEmitter<void> = new EventEmitter();
  @Output() onCancel: EventEmitter<void> = new EventEmitter();
  @Output() onNext: EventEmitter<void> = new EventEmitter();

  form = this.formBuilder.group({
    academicTitle: ['', []],
    firstName: ['', [FormValidators.required]],
    lastName: ['', [FormValidators.required]],
    matriculationNumber: [null, [FormValidators.required]],
    phoneNumber: ['', []],
  });

  constructor(private readonly formBuilder: FormBuilder) {}

  onBackClick(): void {
    this.onBack.emit();
  }

  onCancelClick(): void {
    this.onCancel.emit();
  }

  onNextClick(): void {
    this.onNext.emit();
  }

  getPersonalDetails(): PersonalDetails {
    return {
      academicTitle: this.form.get('academicTitle')?.value ?? null,
      firstName: this.form.get('firstName')?.value ?? '',
      lastName: this.form.get('lastName')?.value ?? '',
      matriculationNumber: this.form.get('matriculationNumber')?.value ?? 0,
      phoneNumber: this.form.get('phoneNumber')?.value ?? '',
    };
  }
}
