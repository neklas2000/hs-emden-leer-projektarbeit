import { Undefinable } from '@Types';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Subscription } from 'rxjs';

export type Credentials = {
  password: string;
  email: string;
};

@Component({
  selector: 'app-register-credentials',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatCheckboxModule,
  ],
  templateUrl: './register-credentials.component.html',
  styleUrl: './register-credentials.component.scss'
})
export class RegisterCredentialsComponent implements OnInit, OnDestroy {
  @Output() onCancel: EventEmitter<void> = new EventEmitter();
  @Output() onNext: EventEmitter<boolean> = new EventEmitter();

  form: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    passwordRepeat: [
      '',
      [
        Validators.required,
        (control: AbstractControl): ValidationErrors | null => {
          if (!control.value || String(control.value).length === 0) return null;
          if (String(control.value) === String(this.form.get('password')?.value ?? '')) return null;

          return {
            passwordMatch: {
              value: control.value,
            },
          };
        },
      ],
    ],
    providePersonalDetails: [true, []],
  });
  hidePassword: boolean = true;
  hideRepeatPassword: boolean = true;
  private subscription: Undefinable<Subscription>;

  constructor(private readonly formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.subscription = this.form.get('password')?.valueChanges.subscribe((changes) => {
      const control = this.form.get('passwordRepeat');

      if (control?.dirty) {
        control.updateValueAndValidity();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  togglePasswordHide(event: MouseEvent): void {
    event.preventDefault();

    this.hidePassword = !this.hidePassword;
  }

  toggleRepeatPasswordHide(event: MouseEvent): void {
    event.preventDefault();

    this.hideRepeatPassword = !this.hideRepeatPassword;
  }

  onCancelClick(): void {
    this.onCancel.emit();
  }

  onNextClick(): void {
    this.onNext.emit(this.form.get('providePersonalDetails')?.value ?? false);
  }

  getCredentials(): Credentials {
    return {
      email: this.form.get('email')?.value ?? '',
      password: this.form.get('password')?.value ?? '',
    };
  }
}
