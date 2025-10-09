import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { I18nModule } from '@i18n/i18n.module';
import { AuthStepperComponent } from '../../../components/auth/auth-stepper/auth-stepper.component';
import { AuthStepComponent } from '../../../components/auth/auth-step/auth-step.component';
import { AuthStepActionsComponent } from '../../../components/auth/auth-step-actions/auth-step-actions.component';
import { FormValidators } from '../../../common/form-validators';
import { AuthenticationService } from '../../../services/authentication.service';
import { Router } from '@angular/router';
import { SnackbarMessage, SnackbarService } from '../../../services/snackbar.service';
import { AppSettingsService } from '../../../services/app-settings.service';

@Component({
  selector: 'hsel-register',
  imports: [
    AuthStepperComponent,
    AuthStepComponent,
    AuthStepActionsComponent,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatIconModule,
    ReactiveFormsModule,
    I18nModule,
    MatInputModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  standalone: true,
})
export class RegisterComponent {
  credentialsForm: FormGroup;
  personalDataForm: FormGroup;
  activeStep = 0;
  hidePassword = true;
  hidePasswordRepeat = true;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly auth: AuthenticationService,
    private readonly router: Router,
    private readonly snackbar: SnackbarService,
    private readonly appSettings: AppSettingsService,
  ) {
    this.credentialsForm = this.formBuilder.group({
      email: [null, [FormValidators.required, FormValidators.email]],
      password: [null, [FormValidators.required]],
      passwordRepeat: [null, [FormValidators.required, FormValidators.match('password')]],
    });
    this.personalDataForm = this.formBuilder.group({
      academicTitle: [null],
      firstName: [null, [FormValidators.required]],
      lastName: [null, [FormValidators.required]],
      matriculationNumber: [null, [FormValidators.min(1)]],
      phoneNumber: [null, [FormValidators.phoneNumber]],
    });
  }

  registerUser(): void {
    this.auth.register({
      emailAddress: this.credentialsForm.value.email,
      password: this.credentialsForm.value.password,
      academicTitle: this.personalDataForm.value.academicTitle,
      firstName: this.personalDataForm.value.firstName,
      lastName: this.personalDataForm.value.lastName,
      matriculationNumber: this.personalDataForm.value.matriculationNumber,
      phoneNumber: this.personalDataForm.value.phoneNumber,
    }).subscribe({
      next: (user) => {
        this.activeStep += 1;
        this.snackbar.info(SnackbarMessage.REGISTER_SUCCESS);
        this.appSettings.loadInitialSettings(user.id);

        setTimeout(() => {
          this.router.navigateByUrl('/');
        }, 1_500);
      },
      error: (err) => {
        console.log(err);
        this.snackbar.error(SnackbarMessage.REGISTER_FAILURE);
      },
    });
  }
}
