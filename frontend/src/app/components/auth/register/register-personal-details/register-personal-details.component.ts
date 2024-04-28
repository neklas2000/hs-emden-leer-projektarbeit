import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { Nullable } from '@Types';

export type PersonalDetails = {
  academicTitle: Nullable<string>;
  firstName: string;
  lastName: string;
  matriculationNumber: number;
  phoneNumber: Nullable<string>;
};

@Component({
  selector: 'app-register-personal-details',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
  ],
  templateUrl: './register-personal-details.component.html',
  styleUrl: './register-personal-details.component.scss'
})
export class RegisterPersonalDetailsComponent {
  @Output() onBack: EventEmitter<void> = new EventEmitter();
  @Output() onCancel: EventEmitter<void> = new EventEmitter();
  @Output() onNext: EventEmitter<void> = new EventEmitter();

  form = this.formBuilder.group({
    academicTitle: ['', []],
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    matriculationNumber: [null, [Validators.required]],
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
