import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

import { Subscription } from 'rxjs';

import { Credentials, RegisterCredentialsComponent } from './register-credentials/register-credentials.component';
import { PersonalDetails, RegisterPersonalDetailsComponent } from './register-personal-details/register-personal-details.component';
import { AuthenticationService } from '@Services/authentication.service';
import { Nullable, Undefinable } from '@Types';
import { ThemeMode, ThemeService } from '@Services/theme.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    RegisterCredentialsComponent,
    RegisterPersonalDetailsComponent,
    MatCardModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit, OnDestroy {
  @ViewChild('provideCredentials') provideCredentials!: RegisterCredentialsComponent;
	@ViewChild('providePersonalDetails') providePersonalDetails!: RegisterPersonalDetailsComponent;

  step: number = 0;
  themeMode: ThemeMode = ThemeMode.DARK;
  private themeSubscription: Undefinable<Subscription> = undefined;

  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly router: Router,
    private readonly theme: ThemeService,
  ) {}

  ngOnInit(): void {
    this.themeSubscription = this.theme.modeStateChanged$.subscribe((mode) => {
      this.themeMode = mode;
    });
  }

  ngOnDestroy(): void {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

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
