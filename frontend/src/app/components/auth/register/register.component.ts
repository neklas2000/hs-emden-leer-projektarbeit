import { Component, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';

import { Credentials, RegisterCredentialsComponent } from '@Components/auth/register/register-credentials/register-credentials.component';
import { PersonalDetails, RegisterPersonalDetailsComponent } from '@Components/auth/register/register-personal-details/register-personal-details.component';
import { LogoComponent } from '@Components/logo/logo.component';
import { AuthenticationService } from '@Services/authentication.service';
import { SnackbarMessage, SnackbarService } from '@Services/snackbar.service';
import { Nullable } from '@Types';
import { HttpException } from '@Utils/http-exception';

@Component({
  selector: 'hsel-register',
  standalone: true,
  imports: [
    LogoComponent,
    RegisterCredentialsComponent,
    RegisterPersonalDetailsComponent,
    MatCardModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  @ViewChild('provideCredentials') provideCredentials!: RegisterCredentialsComponent;
	@ViewChild('providePersonalDetails') providePersonalDetails!: RegisterPersonalDetailsComponent;

  step: number = 0;

  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly router: Router,
    private readonly snackbar: SnackbarService,
  ) {}

  oneStepBack(): void {
    this.step = 0;
  }

  cancel(): void {
    this.router.navigateByUrl('/auth/login');
  }

  nextStep(providePersonalDetails: boolean): void {
    if (!providePersonalDetails) {
      this.registerUser(false);

      return;
    }

    this.step = 1;
  }

  registerUser(readPersonalDetails: boolean): void {
    const credentials: Credentials = this.provideCredentials.getCredentials();
    let personalDetails: Nullable<PersonalDetails> = null;

    if (readPersonalDetails) {
      personalDetails = this.providePersonalDetails.getPersonalDetails();
    }

    this.authenticationService.register({
      ...credentials,
      ...(personalDetails ?? {}),
    }).subscribe({
      next: (registerSuccessful) => {
        if (registerSuccessful) {
          this.step = 2;
          this.snackbar.showInfo(SnackbarMessage.REGISTER_SUCCEEDED);

          const timeout = setTimeout(() => {
            this.router.navigateByUrl('/').then(() => {
              clearTimeout(timeout);
            });
          }, 2000);
        }
      },
      error: (exception: HttpException) => {
        this.snackbar.showException(SnackbarMessage.REGISTER_FAILED, exception);
      },
    });
  }
}
