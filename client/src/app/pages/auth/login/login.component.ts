import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

import { I18nModule } from '@i18n/i18n.module';
import { AuthStepperComponent } from '../../../components/auth/auth-stepper/auth-stepper.component';
import { AuthStepComponent } from '../../../components/auth/auth-step/auth-step.component';
import { AuthStepActionsComponent } from '../../../components/auth/auth-step-actions/auth-step-actions.component';
import { AuthenticationService } from '../../../services/authentication.service';
import { AppSettingsService } from '../../../services/app-settings.service';

@Component({
  selector: 'hsel-login',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    I18nModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    AuthStepperComponent,
    AuthStepComponent,
    AuthStepActionsComponent,
    RouterModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true,
})
export class LoginComponent {
  readonly formGroup: FormGroup;
  passwordHide: boolean = true;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authentication: AuthenticationService,
    private readonly appSettings: AppSettingsService,
  ) {
    this.formGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  togglePasswordHide(ev: MouseEvent): void {
    ev.preventDefault();
    ev.stopPropagation();

    this.passwordHide = !this.passwordHide;
  }

  signIn(): void {
    const formData = this.formGroup.value;

    this.authentication.login(formData.email, formData.password).subscribe({
      next: (loginResponse) => {
        console.log(loginResponse);
        this.appSettings.loadInitialSettings(loginResponse.user.id);
      },
    });
  }
}
