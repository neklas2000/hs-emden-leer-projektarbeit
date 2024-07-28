import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

import { LogoComponent } from '@Components/logo/logo.component';
import { Credentials, RegisterCredentialsComponent } from './register-credentials/register-credentials.component';
import { PersonalDetails, RegisterPersonalDetailsComponent } from './register-personal-details/register-personal-details.component';
import { AuthenticationService } from '@Services/authentication.service';
import { Nullable } from '@Types';

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
    }).subscribe((result) => {
      if (typeof result === 'boolean') {
        this.step = 2;

        const timeout = setTimeout(() => {
          this.router.navigateByUrl('/').then(() => {
            clearTimeout(timeout);
          });
        }, 2000);
      } else {
        console.log(result);
      }
    });
  }
}
