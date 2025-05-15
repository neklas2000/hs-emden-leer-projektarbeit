import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { AuthStepperComponent } from '../../../components/auth/auth-stepper/auth-stepper.component';
import { AuthStepComponent } from '../../../components/auth/auth-step/auth-step.component';
import { AuthStepActionsComponent } from '../../../components/auth/auth-step-actions/auth-step-actions.component';

@Component({
  selector: 'hsel-register',
  imports: [
    AuthStepperComponent,
    AuthStepComponent,
    AuthStepActionsComponent,
    MatButtonModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  standalone: true,
})
export class RegisterComponent {
  activeStep = 0;
}
