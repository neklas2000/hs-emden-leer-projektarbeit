import { Component, ContentChild, HostBinding, Input } from '@angular/core';

import { AuthStepActionsComponent } from '../auth-step-actions/auth-step-actions.component';

@Component({
  selector: 'hsel-auth-step',
  imports: [],
  templateUrl: './auth-step.component.html',
  styleUrl: './auth-step.component.scss',
  standalone: true,
})
export class AuthStepComponent {
  @ContentChild(AuthStepActionsComponent) actions!: AuthStepActionsComponent;
  @HostBinding('style.display') display = 'block';
  @Input() active: boolean = false;

  updateDisplay(displayValue: string): void {
    this.display = displayValue;
  }
}
